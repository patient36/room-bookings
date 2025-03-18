import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    type: {
        type: String,
        enum: ["deposit", "refund", "withdrawal"],
        default: "deposit"
    },
    method: {
        type: String,
        enum: ["card", "momo"],
        default: "card"
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, "Paid amount cannot be negative"]
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "RWF"],
        default: "RWF",
    },
    paymentId: {
        type: String,
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    used: {
        type: Boolean,
        default: false
    },
    withdrawn: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


PaymentSchema.pre('validate', function (next) {
    if (this.currency) {
        this.currency = this.currency.toUpperCase();
    }
    next();
});

const Payment = mongoose.model("Payment", PaymentSchema)

export default Payment