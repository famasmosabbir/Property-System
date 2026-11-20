
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed", "Rejected"],
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
