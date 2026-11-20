
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    lease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lease",
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

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Mobile Banking"],
        required: true
    },

    transactionId: {
        type: String,
        trim: true
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
