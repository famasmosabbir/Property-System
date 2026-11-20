
const mongoose = require("mongoose");

const leaseSchema = new mongoose.Schema({

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

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    monthlyRent: {
        type: Number,
        required: true,
        min: 0
    },

    securityDeposit: {
        type: Number,
        default: 0,
        min: 0
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Active", "Completed", "Terminated"],
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Lease", leaseSchema);
