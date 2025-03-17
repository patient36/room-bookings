import Stripe from 'stripe'
import express from 'express'
import Room from '../models/room.model.js'
import protect from '../middlewares/protect.js'
import Payment from '../models/payment.model.js'

const paymentRouter = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pay by card
paymentRouter.post("/card", protect, async (req, res, next) => {
    try {
        const { amount, currency, roomId } = req.body;

        if (!amount || !currency || !roomId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const room = await Room.findById(roomId).populate("owner");

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });
        // create a new payment
        const payment = await Payment.create({
            payer: req.user._id,
            receiver: room.owner._id,
            amount,
            currency,
            paymentId: paymentIntent.id,
            description: `Booking fees for ${room.name}`
        })

        res.json({ clientSecret: paymentIntent.client_secret, payment });
    } catch (error) {
        next(error)
    }
})

// Stripe webhook handler
paymentRouter.post('/card/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        res.status(200).json({ message: "Stripe Webhook received" });

        const payment = await Payment.findOne({ paymentId: event.data.object.id });

        if (!payment) {
            console.error("Payment not found for paymentId:", event.data.object.id);
            return;
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                payment.status = "completed";
                await payment.save();
                console.log(`Payment succeeded: ${payment.paymentId}`);
                break;

            case 'payment_intent.payment_failed':
                payment.status = "failed";
                await payment.save();
                console.log(`Payment failed: ${payment.paymentId}`);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
});


// Pay by MTN MoMo
paymentRouter.post("/momo", async (req, res, next) => {
    try {
        res.status(200).json({ payment: "momo" })
    } catch (error) {
        next(error)
    }
})

// MoMo callback to confirm payment
paymentRouter.post('/momo/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    res.status(200).json({ message: "MoMo Webhook received" });
})

export default paymentRouter 