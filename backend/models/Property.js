
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    propertyType: {
        type: String,
        enum: ["Apartment", "House", "Commercial", "Land"],
        required: true
    },

    rent: {
        type: Number,
        required: true,
        min: 0
    },

    bedrooms: {
        type: Number,
        default: 0,
        min: 0
    },

    bathrooms: {
        type: Number,
        default: 0,
        min: 0
    },

    status: {
        type: String,
        enum: ["Available", "Rented"],
        default: "Available"
    },

    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
