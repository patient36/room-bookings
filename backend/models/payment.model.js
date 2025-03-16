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
    type: {
        type: String,
        enum: ["deposit", "refund", "disbursement"],
        required: true,
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
        enum: ["usd", "eur", "rwf"],
        default: "rwf",
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
    }
}, { timestamps: true })


const Payment = mongoose.model("Payment", PaymentSchema)

export default Payment