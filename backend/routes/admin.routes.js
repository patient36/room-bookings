import express from "express"
import { isAdmin } from "../middlewares/verifyUser.js"
import protect from "../middlewares/protect.js"
import Room from "../models/room.model.js"
import Booking from "../models/booking.model.js"
import User from "../models/user.model.js"
import sendEmail from "../utils/ses.js"
import sendSMS from "../utils/sns.js"
import generateToken from "../utils/generateToken.js"
import jwt from "jsonwebtoken"

const adminRouter = express.Router()

async function notifyUser(user, message, subject) {
    await sendSMS(user.phone, message);
    await sendEmail(user.email, message, subject);
}

// register as admin
adminRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password, name, phone, admin_token, PhoneOTP, EmailOTP } = req.body;
        if (!EmailOTP || !PhoneOTP) {
            return res.status(400).json({ message: "Check your emails and SMS for verification codes." });
        }

        const validEmail = await verifyOTP(email, EmailOTP)
        const validPhone = await verifyOTP(phone, PhoneOTP)
        if (!validEmail.success) {
            return res.status(400).json({ message: validEmail.message });
        }

        if (!validPhone.success) {
            return res.status(400).json({ message: validPhone.message });
        }

        if (!admin_token) {
            return res.status(403).json({ message: "Admin token is required" });
        }

        let issuerId;
        try {
            const decoded = jwt.verify(admin_token, process.env.ADMIN_SIGNUP_TOKEN);
            issuerId = decoded.id;
        } catch (error) {
            return res.status(403).json({ message: "Invalid or expired admin token" });
        }

        const issuer = await User.findById(issuerId);
        if (!issuer || issuer.accountType !== "admin") {
            return res.status(403).json({ message: "Only admins can issue admin tokens" });
        }

        const user = await User.create({ email, password, name, phone, accountType: "admin" });

        // Generate a token for the new admin
        generateToken(res, user._id);

        // Notify other admins
        const admins = await User.find({
            accountType: "admin",
            _id: { $nin: [issuerId, user._id] },
        });

        if (admins.length > 0) {
            const message = `A new system admin has been registered by ${issuer.name} (${issuer.email}).`;
            const subject = "New System Admin Registered";
            for (const admin of admins) {
                await notifyUser(admin, message, subject);
            }
        }

        // Notify the issuer
        const issuerMessage = `You have successfully registered a new system admin: ${user.name} (${user.email}).`;
        await notifyUser(issuer, issuerMessage, "New Admin Registered");

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            message: "System admin created successfully",
        });
    } catch (error) {
        next(error);
    }
});

// get current admin token
adminRouter.get('/get-token', [protect, isAdmin], (req, res, next) => {
    try {
        const userId = req.user._id;

        const token = jwt.sign(
            { id: userId },
            process.env.ADMIN_SIGNUP_TOKEN,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

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

// get all bookings
adminRouter.get('/all-bookings', [protect, isAdmin], async (req, res, next) => {
    try {
        const sort = req.query.sort || "createdAt"
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const skip = (page - 1) * limit

        const totalBookings = await Booking.countDocuments({})
        const totalPages = Math.ceil(totalBookings / limit)

        if (page > totalPages) {
            return res.status(200).json({
                meta: {
                    totalPages,
                    pageSize: 0,
                    page,
                    message: "Page not found",
                },
                data: {
                    bookings: []
                }
            })
        }

        const bookings = await Booking.find({}).sort({ [sort]: -1 }).skip(skip).limit(limit)
        res.status(200).json({
            meta: {
                sort,
                totalPages,
                pageSize: bookings.length,
                page
            },
            data: { bookings }
        })

    } catch (error) {
        next(error)
    }
})

// get all users
adminRouter.get('/all-users', [protect, isAdmin], async (req, res, next) => {
    try {
        const sort = req.query.sort || "createdAt"
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const skip = (page - 1) * limit

        const totalUsers = await User.countDocuments({})
        const totalPages = Math.ceil(totalUsers / limit)

        if (page > totalPages) {
            return res.status(200).json({
                meta: {
                    totalPages,
                    pageSize: 0,
                    page,
                    message: "Page not found",
                },
                data: {
                    users: []
                }
            })
        }

        const users = await User.find({}).sort({ [sort]: -1 }).skip(skip).limit(limit)
        res.status(200).json({
            meta: {
                sort,
                totalPages,
                pageSize: users.length,
                page
            },
            data: { users }
        })

    } catch (error) {
        next(error)
    }
})

// activate room
adminRouter.put('/activate-room', [protect, isAdmin], async (req, res, next) => {
    try {
        const roomId = req.body.roomId
        const room = await Room.findOne({ _id: roomId, status: "inactive" }).populate("owner")
        if (!room) {
            return res.status(404).json({ message: "Room not found" })
        }
        await Room.updateOne({ _id: roomId }, { $set: { status: "active" } })

        // notify room owner
        const owner = room.owner
        const text = `Dear ${owner.name}, we are pleased to inform you that your room ${room.name} has been activated and now it is open for booking. `
        const subject = "Room activation"
        await notifyUser(owner, text, subject)

        res.status(200).json({ message: "Room activated successfully" })
    } catch (error) {
        next(error)
    }
})

// deactivate room
adminRouter.put('/deactivate-room', [protect, isAdmin], async (req, res, next) => {
    try {
        const roomId = req.body.roomId
        const room = await Room.findOne({ _id: roomId, status: "active" }).populate("owner")
        if (!room) {
            return res.status(404).json({ message: "Room not found" })
        }
        await Room.updateOne({ _id: roomId }, { $set: { status: "inactive" } })

        // notify owner
        const owner = room.owner
        const text = `Dear ${owner.name}, we are sorry to inform you that your room ${room.name} has been temporarily deactivated and  it will be closed for booking until re-activation. `
        const subject = "Room de-activation"
        await notifyUser(owner, text, subject)

        res.status(200).json({ message: "Room deactivated successfully" })
    } catch (error) {
        next(error)
    }
})

// revoke user room owner access
adminRouter.put('/revoke-owner', [protect, isAdmin], async (req, res, next) => {
    try {
        const userId = req.body.userId
        const user = await User.findOne({ _id: userId, accountType: "owner" })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        await User.updateOne({ _id: userId }, { $set: { accountType: "booker" } })

        // notify user
        const message = `Dear ${user.name}, we are sorry to inform you that you have been revoked access to your rooms temporarily due to not complying with our terms and conditions .`
        const subject = "Rooms access revoked"
        await notifyUser(user, message, subject)

        res.status(200).json({ message: "Room owner access revoked successfully" })
    } catch (error) {
        next(error)
    }
})

// grant user room owner access
adminRouter.put('/grant-owner', [protect, isAdmin], async (req, res, next) => {
    try {
        const userId = req.body.userId
        const user = await User.findOne({ _id: userId, accountType: "booker" })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        await User.updateOne({ _id: userId }, { $set: { accountType: "owner" } })

        // notify user
        const message = `Dear ${user.name}, we are pleased to inform you that you have been granted access to your rooms.`
        const subject = "Rooms access granted"
        await notifyUser(user, message, subject)

        res.status(200).json({ message: "Room owner access granted successfully" })
    } catch (error) {
        next(error)
    }
})

export default adminRouter