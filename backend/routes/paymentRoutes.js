
const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Lease = require("../models/Lease");
const { protect, authorize } = require("../middleware/authMiddleware");

// ================= CREATE PAYMENT =================

router.post("/", protect, authorize("tenant"), async (req, res) => {
    try {
        const { leaseId, amount, paymentMethod, transactionId } = req.body;

        if (!leaseId || !amount || !paymentMethod) {
            return res.status(400).json({
                message: "Lease ID, amount and payment method are required"
            });
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid payment amount"
            });
        }

        const allowedMethods = [
            "Cash",
            "Bank Transfer",
            "Mobile Banking"
        ];

        if (!allowedMethods.includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        const lease = await Lease.findById(leaseId);

        if (!lease) {
            return res.status(404).json({
                message: "Lease not found"
            });
        }

        if (lease.tenant.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot pay for another tenant's lease"
            });
        }

        if (!["Approved", "Active"].includes(lease.status)) {
            return res.status(400).json({
                message: "Payment is allowed only for approved or active leases"
            });
        }

        const payment = await Payment.create({
            lease: lease._id,
            tenant: req.user._id,
            landlord: lease.landlord,
            amount,
            paymentMethod,
            transactionId,
            status: "Pending"
        });

        res.status(201).json({
            message: "Payment record created successfully",
            payment
        });

    } catch (error) {
        console.error("Payment error:", error.message);

        res.status(500).json({
            message: "Failed to create payment"
        });
    }
});

// ================= VIEW MY PAYMENTS =================

router.get("/my-payments", protect, async (req, res) => {
    try {
        const filter = req.user.role === "tenant"
            ? { tenant: req.user._id }
            : { landlord: req.user._id };

        const payments = await Payment.find(filter)
            .populate("lease")
            .populate("tenant", "name email")
            .populate("landlord", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: payments.length,
            payments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch payments"
        });
    }
});

// ================= UPDATE PAYMENT STATUS =================

router.patch("/:id/status", protect, authorize("landlord"), async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Completed", "Failed"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Completed or Failed"
            });
        }

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (payment.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot update this payment"
            });
        }

        if (payment.status !== "Pending") {
            return res.status(400).json({
                message: "Only pending payments can be updated"
            });
        }

        payment.status = status;
        await payment.save();

        res.status(200).json({
            message: "Payment status updated successfully",
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update payment status"
        });
    }
});

module.exports = router;
