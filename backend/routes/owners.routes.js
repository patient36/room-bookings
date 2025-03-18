import express from "express"
import Room from "../models/room.model.js"
import upload from "../middlewares/upload.js"
import protect from "../middlewares/protect.js"
import deleteFile from "../utils/deleteFile.js"
import sendEmail from "../utils/ses.js"
import sendSMS from "../utils/sns.js"
import { isOwner } from "../middlewares/verifyUser.js"
import Booking from "../models/booking.model.js"
import Payment from "../models/payment.model.js"

const ownersRouter = express.Router()

// Get all of my rooms
ownersRouter.get('/my-rooms', [protect, isOwner], async (req, res, next) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const totalRooms = await Room.countDocuments({ owner: user._id });
        const totalPages = Math.ceil(totalRooms / limit);

        if (page > totalPages) {
            return res.status(200).json({
                meta: {
                    user: user.name,
                    totalPages,
                    pageSize: 0,
                    page,
                    message: "Page not found",
                },
                data: {
                    rooms: []
                }
            });
        }

        const rooms = await Room.find({ owner: user._id }).skip(skip).limit(limit);

        res.status(200).json({
            meta: {
                user: user.name,
                page,
                totalPages,
                pageSize: rooms.length
            },
            data: {
                rooms
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get one room 
ownersRouter.get('/room/:id', [protect, isOwner], async (req, res, next) => {
    try {
        const user = req.user;
        const roomId = req.params.id;

        // Fetch the room and check if it exists
        const room = await Room.findOne({ _id: roomId, owner: user._id });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find related bookings
        const bookings = await Booking.find({ roomId: room._id })
        // Send the room data as the response
        res.status(200).json({ room, bookings });
    } catch (error) {
        next(error); // Delegate error handling to middleware
    }
});

// Create a room
ownersRouter.post('/create', [protect, isOwner, upload.fields([{ name: "room_image", minCount: 1 }])], async (req, res, next) => {
    try {
        const user = req.user;
        const { name, description, area, capacity, price_per_hour, street, location, amenities } = req.body;

        // Validate required fields
        if (!name || !description || !price_per_hour || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Handle room images
        const files = req.files?.room_image || [];
        const room_images = files.map(file => file.location);

        // Handle amenities
        const amenitiesArray = amenities ? amenities.split(",").map(item => item.trim()) : [];

        // Create the room
        const room = await Room.create({
            name, description, area, capacity, price_per_hour, street, location,
            amenities: amenitiesArray,
            owner: user._id,
            images: room_images
        });
        // save room on its owner
        user.rooms.push(room._id)
        await user.save()

        await sendEmail(user.email, `Room ${room.name} has been created successfully`, "Room created",);
        await sendSMS(user.phone, `Room ${room.name} has been created successfully`);
        res.status(201).json({ message: 'Room created successfully', room });
    } catch (error) {
        next(error);
    }
});

// update a room
ownersRouter.put('/room/:id', [protect, isOwner, upload.fields([{ name: "room_image" }])], async (req, res, next) => {
    try {
        const { user, params: { id: roomId }, body, files } = req;
        const allowedFields = new Set(["name", "description", "area", "capacity", "price_per_hour", "street", "location", "amenities"]);

        // Filter valid fields
        const updates = Object.entries(body).reduce((acc, [key, value]) => {
            if (allowedFields.has(key)) acc[key] = value;
            return acc;
        }, {});

        // Handle room images update
        if (files?.room_image?.length) {
            updates.images = { $each: files.room_image.map(file => file.location) };
        }

        // Update room in a single query
        const room = await Room.findOneAndUpdate(
            { _id: roomId, owner: user._id },
            { $set: updates, ...(updates.images && { $push: { images: updates.images } }) },
            { new: true }
        );

        if (!room) return res.status(404).json({ message: "Room not found" });

        // Notify bookers about the changes
        const bookings = await Booking.find({ roomId }).populate("bookerId");

        await Promise.all([
            ...bookings.map(({ bookerId }) => {
                const message = `Dear ${bookerId.name}, the room you booked ("${room.name}") has been updated. Please review the changes.`;
                return Promise.all([sendEmail(bookerId.email, message, 'Room Update Notification'), sendSMS(bookerId.phone, message)]);
            }),
            sendEmail(user.email, `Dear ${user.name}, your room "${room.name}" was updated successfully.`, "Room updated"),
            sendSMS(user.phone, `Dear ${user.name}, your room "${room.name}" was updated successfully.`)
        ]);

        res.status(200).json({ message: "Room updated successfully", room });

    } catch (error) {
        next(error);
    }
});

// delete a room
ownersRouter.delete('/room/:id', [protect, isOwner], async (req, res, next) => {
    try {
        const user = req.user;
        const roomId = req.params.id;

        const room = await Room.findOne({ _id: roomId, owner: user._id });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const bookings = await Booking.find({ roomId }).populate("bookerId");

        // Notify bookers
        if (bookings.length > 0) {
            const bookingNotifications = bookings.map(async (booking) => {
                const message = `Dear ${booking.bookerId.name}, we are deeply sorry to inform you that your booking for ${room.name} from ${new Date(booking.checkIn).toISOString()} to ${new Date(booking.checkOut).toISOString()} was cancelled because the room is no longer available. Apologies for the inconvenience.`;
                const subject = "Booking Cancelled";
                return Promise.all([
                    sendEmail(booking.bookerId.email, message, subject),
                    sendSMS(booking.bookerId.phone, message)
                ]);
            });
            await Promise.all(bookingNotifications);
        }

        // Notify room owner
        const ownerMessage = `Dear ${user.name}, your room "${room.name}" was deleted successfully.`;
        const ownerSubject = "Room Deleted";
        await Promise.all([
            sendEmail(user.email, ownerMessage, ownerSubject),
            sendSMS(user.phone, ownerMessage)
        ]);

        // Delete room images (run in parallel)
        const imageDeletions = room.images.map((image) => deleteFile(image));
        await Promise.all(imageDeletions);

        // Delete related bookings and room
        await Promise.all([
            Booking.deleteMany({ roomId: room._id }),
            Room.deleteOne({ _id: room._id })
        ]);

        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        next(error);
    }
});


//Payments for my rooms
ownersRouter.get('/payments', [protect, isOwner], async (req, res, next) => {
    try {
        const user = req.user;
        const payments = await Payment.find({ receiver: user._id });
        res.status(200).json({ payments });
    } catch (error) {
        next(error);
    }
});

export default ownersRouter