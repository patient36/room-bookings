import express from "express"
import Room from "../models/room.model.js"
import Booking from "../models/booking.model.js"
import protect from "../middlewares/protect.js"
import sendSMS from "../utils/sns.js"
import sendEmail from "../utils/ses.js"
import processBooking from "../utils/processBooking.js"
import { isActive, isAvailable } from "../middlewares/roomStatus.js"
import { hasPaid } from "../middlewares/hasPaid.js"
import Payment from "../models/payment.model.js"

const bookersRouter = express.Router()

async function notifyUser(user, message, subject) {
    await sendSMS(user.phone, message);
    await sendEmail(user.email, message, subject);
}

// book room
bookersRouter.post("/book-room", [protect, isActive, isAvailable, hasPaid], async (req, res, next) => {
    try {
        const user = req.user;
        const { checkIn, checkOut } = req.body;
        const room = req.room;

        // Create the new booking
        const booking = await Booking.create({ checkIn, checkOut, bookerId: user._id, roomId: room._id });
        booking.fees = room.price_per_hour * booking.duration;
        booking.payment = req.payment._id;
        await booking.save();

        // Update room details
        room.total_hours_booked += booking.duration;
        room.revenue += booking.fees;
        await room.save();

        // Update user bookings
        user.bookings.push(booking._id);
        await user.save();

        // mark payment as used
        await Payment.findOneAndUpdate({ _id: req.payment._id }, { $set: { used: true } });

        // Send notifications
        const message = `Booking for room ${room.name} from ${new Date(booking.checkIn).toISOString()} to ${new Date(booking.checkOut).toISOString()} by ${user.name} was successful.`;
        const subject = "Booking Success";
        await notifyUser(user, message, subject);
        await notifyUser(room.owner, message, subject);

        return res.status(201).json({ message: "Booking created successfully", booking });

    } catch (error) {
        next(error);
    }
});

// cancel booking
bookersRouter.post("/cancel-booking", [protect, isActive], async (req, res, next) => {
    try {
        const user = req.user;
        const { roomId, bookingId } = req.body;

        // Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check if booking exists and belongs to the user
        const booking = await Booking.findOne({ _id: bookingId, roomId, bookerId: user._id }).populate("bookerId");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if booking status is active or pending
        if (booking.status !== "active" && booking.status !== "pending") {
            return res.status(400).json({ message: `Failed to cancel a ${booking.status} booking` });
        }

        // Cancel the booking
        booking.status = "cancelled";
        await booking.save();

        // Update room's total hours and revenue
        room.total_hours_booked -= booking.duration;
        await room.save();

        // Notification text
        const text = `Booking for room ${room.name} that was to start from ${new Date(booking.checkIn).toISOString()} and end at ${new Date(booking.checkOut).toISOString()} was cancelled by ${user.name} who was the booker.`;
        const subject = "Booking cancelled";

        // Notify the user and the owner
        await notifyUser(user, text, subject);
        await notifyUser(booking.bookerId, text, subject);

        // Respond with success
        res.status(200).json({ message: "Booking cancelled successfully", booking });

    } catch (error) {
        next(error);
    }
});

// my bookings
bookersRouter.get('/my-bookings', [protect, isActive], async (req, res, next) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            Booking.find({ bookerId: user._id })
                .populate("roomId payment")
                .skip(skip)
                .limit(limit),
            Booking.countDocuments({ bookerId: user._id })
        ]);

        res.status(200).json({
            bookings,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBookings: total
        });
    } catch (error) {
        next(error);
    }
});

// get all active rooms
bookersRouter.get('/', async (req, res, next) => {
    try {
        const { sort = "createdAt", page = 1, limit = 10, minPrice, maxPrice, minCapacity } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        let filter = { status: "active" };

        // Price range filtering
        if (minPrice || maxPrice) {
            filter.price_per_hour = {};
            if (minPrice) filter.price_per_hour.$gte = parseInt(minPrice, 10);
            if (maxPrice) filter.price_per_hour.$lte = parseInt(maxPrice, 10);
        }

        // Capacity filter (min only)
        if (minCapacity) {
            filter.capacity = { $gte: parseInt(minCapacity, 10) };
        }

        const totalRooms = await Room.countDocuments(filter);
        const totalPages = Math.ceil(totalRooms / limitNum);

        if (pageNum > totalPages) {
            return res.status(200).json({
                meta: {
                    totalPages,
                    pageSize: 0,
                    page: pageNum,
                    message: "Page not found",
                },
                data: { rooms: [] }
            });
        }

        let sortOptions = {};
        if (sort) {
            sort.split(',').forEach(field => {
                sortOptions[field] = -1;
            });
        }

        const rooms = await Room.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            meta: {
                sort,
                totalPages,
                pageSize: rooms.length,
                page: pageNum
            },
            data: { rooms }
        });
    } catch (error) {
        next(error);
    }
});

// get room by id
bookersRouter.get('/:id', async (req, res, next) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findOne({ _id: roomId, status: "active" }).select("-total_hours_booked -owner -status");
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ room });
    } catch (error) {
        next(error);
    }
});

// get available rooms
bookersRouter.post('/available-rooms', async (req, res, next) => {
    try {
        const rooms = await Room.find()
        const { checkIn, checkOut } = req.body
        let interval = { checkIn, checkOut }
        let availableRooms = []
        for (let room of rooms) {
            let bookings = await Booking.find({ roomId: room._id })
            const result = processBooking(bookings, interval)
            if (result.roomAvailable) {
                availableRooms.push({ name: room.name, id: room._id, location: room.location, street: room.street, price_per_hour: room.price_per_hour })
            }
        }
        res.status(200).json({ availableRooms })
    } catch (error) {
        next(error)
    }
})

// get my expenses
bookersRouter.get('/expenses', [protect], async (req, res, next) => {
    try {
        const user = req.user;
        const expenses = await Payment.find({ payer: user._id });
        res.status(200).json({ expenses });
    } catch (error) {
        next(error);
    }
});

export default bookersRouter