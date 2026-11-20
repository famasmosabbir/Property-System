
const express = require("express");
const router = express.Router();

const Maintenance = require("../models/Maintenance");
const Property = require("../models/Property");
const Lease = require("../models/Lease");
const { protect, authorize } = require("../middleware/authMiddleware");

// ================= CREATE MAINTENANCE REQUEST =================

router.post("/", protect, authorize("tenant"), async (req, res) => {
    try {
        const { propertyId, title, description, priority } = req.body;

        if (!propertyId || !title || !description) {
            return res.status(400).json({
                message: "Property ID, title and description are required"
            });
        }

        const allowedPriorities = ["Low", "Medium", "High", "Urgent"];

        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        const activeLease = await Lease.findOne({
            property: propertyId,
            tenant: req.user._id,
            status: { $in: ["Approved", "Active"] }
        });

        if (!activeLease) {
            return res.status(403).json({
                message: "You need an approved lease for this property"
            });
        }

        const request = await Maintenance.create({
            property: property._id,
            tenant: req.user._id,
            landlord: property.landlord,
            title: title.trim(),
            description: description.trim(),
            priority: priority || "Medium"
        });

        res.status(201).json({
            message: "Maintenance request submitted successfully",
            request
        });

    } catch (error) {
        console.error("Maintenance request error:", error.message);

        res.status(500).json({
            message: "Failed to submit maintenance request"
        });
    }
});

// ================= VIEW MY MAINTENANCE REQUESTS =================

router.get("/my-requests", protect, async (req, res) => {
    try {
        const filter = req.user.role === "tenant"
            ? { tenant: req.user._id }
            : { landlord: req.user._id };

        const requests = await Maintenance.find(filter)
            .populate("property")
            .populate("tenant", "name email")
            .populate("landlord", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Failed to fetch maintenance requests"
        });
    }
});

// ================= UPDATE MAINTENANCE STATUS =================

router.patch("/:id/status", protect, authorize("landlord"), async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "In Progress",
            "Completed",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid maintenance status"
            });
        }

        const request = await Maintenance.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Maintenance request not found"
            });
        }

        if (request.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot update this request"
            });
        }

        if (["Completed", "Rejected"].includes(request.status)) {
            return res.status(400).json({
                message: "This request is already closed"
            });
        }

        request.status = status;
        await request.save();

        res.status(200).json({
            message: "Maintenance status updated successfully",
            request
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Failed to update maintenance request"
        });
    }
});

module.exports = router;
