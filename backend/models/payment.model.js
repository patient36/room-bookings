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
    paymentIntentId: {
        type: String,
    },
}, { timestamps: true })


const Payment = mongoose.model("Payment", PaymentSchema)

export default Payment