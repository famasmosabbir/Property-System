

const express = require("express");
const router = express.Router();

const Property = require("../models/Property");
const { protect, authorize } = require("../middleware/authMiddleware");

// ================= ADD PROPERTY =================

router.post("/", protect, authorize("landlord"), async (req, res) => {
    try {
        const {
            title,
            description,
            address,
            propertyType,
            rent,
            bedrooms,
            bathrooms
        } = req.body;

        if (!title || !description || !address || !propertyType || rent === undefined) {
            return res.status(400).json({
                message: "Please provide all required property details"
            });
        }

        const property = await Property.create({
            title,
            description,
            address,
            propertyType,
            rent,
            bedrooms,
            bathrooms,
            landlord: req.user._id
        });

        res.status(201).json({
            message: "Property added successfully",
            property
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to add property"
        });
    }
});


// ================= GET ALL PROPERTIES =================

router.get("/", async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("landlord", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: properties.length,
            properties
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch properties"
        });
    }
});


// ================= GET SINGLE PROPERTY =================

router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate("landlord", "name email");

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        res.status(200).json({
            property
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid property ID"
        });
    }
});


// ================= UPDATE PROPERTY =================

router.put("/:id", protect, authorize("landlord"), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        if (property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot update another landlord's property"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "address",
            "propertyType",
            "rent",
            "bedrooms",
            "bathrooms",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

        await property.save();

        res.status(200).json({
            message: "Property updated successfully",
            property
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to update property"
        });
    }
});


// ================= DELETE PROPERTY =================

router.delete("/:id", protect, authorize("landlord"), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        if (property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot delete another landlord's property"
            });
        }

        await property.deleteOne();

        res.status(200).json({
            message: "Property deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to delete property"
        });
    }
});

module.exports = router;
