import Payment from "../models/payment.model.js";

export const hasPaid = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ _id: req.body.paymentId, roomId: req.room._id, payer: req.user._id, status: "completed", used: false });
        if (!payment) {
            return res.status(400).json({ message: "No payment found for this booking" });
        }
        req.payment = payment;
        next();
    } catch (error) {
        next(error);
    }
}