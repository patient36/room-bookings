import express from 'express'
import Payment from '../models/payment.model.js'
import Stripe from 'stripe'

const paymentRouter = express.Router()

// Pay by card
paymentRouter.post("/card", async (req, res, next) => {
    try {
        res.status(200).json({ payment: "card" })
    } catch (error) {
        next(error)
    }
})

// Stripe webhook to confirm payment
paymentRouter.post('/card/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    res.status(200).json({ message: "Stripe Webhook received" });
})


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