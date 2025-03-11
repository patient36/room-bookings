import express from "express"
import { isAdmin } from "../middlewares/verifyUser.js"
import protect from "../middlewares/protect.js"
import Room from "../models/room.model.js"
import Booking from "../models/booking.model.js"
import User from "../models/user.model.js"
import sendEmail from "../utils/ses.js"
import sendSMS from "../utils/sns.js"

const adminRouter = express.Router()

// get all rooms
adminRouter.get('/all-rooms', [protect, isAdmin], async (req, res, next) => {
    try {
        const sort = req.query.sort || "createdAt"
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const skip = (page - 1) * limit

        const totalRooms = await Room.countDocuments({})
        const totalPages = Math.ceil(totalRooms / limit)

        if (page > totalPages) {
            return res.status(200).json({
                meta: {
                    totalPages,
                    pageSize: 0,
                    page,
                    message: "Page not found",
                },
                data: {
                    rooms: []
                }
            })
        }

        const rooms = await Room.find({}).sort({ [sort]: -1 }).skip(skip).limit(limit)
        res.status(200).json({
            meta: {
                sort,
                totalPages,
                pageSize: rooms.length,
                page
            },
            data: { rooms }
        })

    } catch (error) {
        next(error)
    }
})

export default adminRouter