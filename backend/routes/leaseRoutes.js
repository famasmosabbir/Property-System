
const express = require("express");
const router = express.Router();

const Lease = require("../models/Lease");
const Property = require("../models/Property");
const { protect, authorize } = require("../middleware/authMiddleware");

// CREATE LEASE REQUEST
router.post("/", protect, authorize("tenant"), async (req, res) => {
    try {
        const { propertyId, startDate, endDate } = req.body;

        if (!propertyId || !startDate || !endDate) {
            return res.status(400).json({
                message: "Property ID, start date and end date are required"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({
                message: "Please provide valid lease dates"
            });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        if (property.status !== "Available") {
            return res.status(400).json({
                message: "Property is not available"
            });
        }

        const existingLease = await Lease.findOne({
            property: propertyId,
            tenant: req.user._id,
            status: { $in: ["Pending", "Approved", "Active"] }
        });

        if (existingLease) {
            return res.status(409).json({
                message: "You already have an active request for this property"
            });
        }

        const lease = await Lease.create({
            property: property._id,
            tenant: req.user._id,
            landlord: property.landlord,
            startDate: start,
            endDate: end,
            monthlyRent: property.rent
        });

        res.status(201).json({
            message: "Lease request submitted successfully",
            lease
        });

    } catch (error) {
        console.error("Lease request error:", error.message);
        res.status(500).json({
            message: "Failed to create lease request"
        });
    }
});

// VIEW MY LEASES
router.get("/my-leases", protect, async (req, res) => {
    try {
        const filter = req.user.role === "tenant"
            ? { tenant: req.user._id }
            : { landlord: req.user._id };

        const leases = await Lease.find(filter)
            .populate("property")
            .populate("tenant", "name email")
            .populate("landlord", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: leases.length,
            leases
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leases"
        });
    }
});

// APPROVE OR REJECT LEASE
router.patch("/:id/status", protect, authorize("landlord"), async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Approved or Rejected"
            });
        }

        const lease = await Lease.findById(req.params.id);

        if (!lease) {
            return res.status(404).json({
                message: "Lease not found"
            });
        }

        if (lease.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot manage this lease"
            });
        }

        if (lease.status !== "Pending") {
            return res.status(400).json({
                message: "Only pending requests can be updated"
            });
        }

        if (status === "Approved") {
            const property = await Property.findById(lease.property);

            if (!property || property.status !== "Available") {
                return res.status(409).json({
                    message: "Property is no longer available"
                });
            }

            property.status = "Rented";
            await property.save();
        }

        lease.status = status;
        await lease.save();

        res.status(200).json({
            message: `Lease ${status.toLowerCase()} successfully`,
            lease
        });

    } catch (error) {
        console.error("Lease update error:", error.message);
        res.status(500).json({
            message: "Failed to update lease"
        });
    }
});

module.exports = router;
