import Stripe from 'stripe'
import express from 'express'
import Room from '../models/room.model.js'
import protect from '../middlewares/protect.js'
import Payment from '../models/payment.model.js'
import crypto from 'crypto'

const paymentRouter = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pay by card
paymentRouter.post("/card", protect, async (req, res, next) => {
    try {
        const { amount, roomId } = req.body;
        const currency = req.body.currency?.toUpperCase() ?? null;

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
            roomId,
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
paymentRouter.post("/momo", protect, async (req, res, next) => {
    try {
        const API_TOKEN = process.env.PAWA_PAY_TOKEN;
        const endPoint = process.env.PAWA_PAY_ENDPOINT;
        const { amount, phone, roomId } = req.body;
        const currency = req.body.currency?.toUpperCase() ?? "RWF";

        if (!amount || !phone || !roomId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const room = await Room.findById(roomId).populate("owner");
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const uuid = crypto.randomUUID();

        const requestBody = JSON.stringify({
            depositId: uuid,
            amount: amount.toString(),
            currency,
            correspondent: "MTN_MOMO_RWA",
            payer: {
                type: "MSISDN",
                address: {
                    value: phone
                }
            },
            customerTimestamp: new Date().toISOString(),
            statementDescription: `Booking fees`,
            country: "RWA"
        });

        const contentDigest = crypto.createHash('sha256').update(requestBody).digest('base64');

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Digest': `SHA-256=${contentDigest}`
            },
            body: requestBody
        };

        const response = await fetch(`${endPoint}/deposits`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`PawaPay API Error: ${errorData.message || response.statusText}`);
        }

        const responseData = await response.json();
        if (responseData.status !== "ACCEPTED") {
            return res.status(400).json({ message: "Payment failed", response: responseData });
        }

        const payment = await Payment.create({
            payer: req.user._id,
            receiver: room.owner._id,
            roomId,
            amount,
            method: "momo",
            paymentId: responseData.depositId,
            description: `Booking fees for ${room.name}`
        });

        res.status(200).json({ payment });

    } catch (error) {
        next(error);
    }
});

// MoMo callback to confirm payment
paymentRouter.post('/momo/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const data = req.body;
        const payment = await Payment.findOne({ paymentId: data.depositId });

        if (!payment) {
            console.error("Payment not found for paymentId:", data.depositId);
            return;
        }

        switch (data.status) {
            case "COMPLETED":
                payment.status = "completed";
                await payment.save();
                console.log(`Payment succeeded: ${payment.paymentId}`);
                break;

            case "FAILED":
                payment.status = "failed";
                await payment.save();
                console.log(`Payment failed: ${payment.paymentId}`);
                break;

            default:
                console.log(`Unhandled Payment status: ${data.status}`);
        }
        res.status(200).json({ message: "MoMo Webhook received" });
    } catch (error) {
        console.error("MoMo Webhook Error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
})

export default paymentRouter 