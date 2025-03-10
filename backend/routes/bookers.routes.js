import express from "express"
import Room from "../models/room.model.js"
import Booking from "../models/booking.model.js"
import protect from "../middlewares/protect.js"
import sendSMS from "../utils/sns.js"
import sendEmail from "../utils/ses.js"
import processBooking from "../utils/processBooking.js"

const bookersRouter = express.Router()

async function notifyUser(user, message, subject) {
    await sendSMS(user.phone, message);
    await sendEmail(user.email, message, subject);
}

bookersRouter.post("/book-room", protect, async (req, res, next) => {
    try {
        const user = req.user;
        const { checkIn, checkOut, roomId } = req.body;

        // Check if the room exists with its owner details
        const room = await Room.findOne({ _id: roomId }).populate("owner");
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Fetch active and pending bookings for this room
        const bookings = await Booking.find({ roomId, status: { $in: ["active", "pending"] } });

        if (bookings.length) {
            const incomingBooking = { checkIn, checkOut };
            const result = processBooking(bookings, incomingBooking);

            if (!result.roomAvailable) {
                return res.status(409).json({ message: "Room unavailable", availableDates: result.availableDates });
            }
        }

        // Create the new booking
        const booking = await Booking.create({ checkIn, checkOut, bookerId: user._id, roomId });
        booking.fees = room.price_per_hour * booking.duration;
        await booking.save();

        // Update room details
        room.total_hours_booked += booking.duration;
        room.revenue += booking.fees;
        await room.save();

        // Update user bookings
        user.bookings.push(booking._id);
        await user.save();

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
bookersRouter.post("/cancel-booking", protect, async (req, res, next) => {
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
        room.revenue -= booking.fees;
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

// edit booking
bookersRouter.put('/edit-booking', protect, async (req, res, next) => {
    try {
        const user = req.user;
        const { roomId, bookingId, checkIn, checkOut } = req.body;

        // Validate checkIn and checkOut
        if (!checkIn || !checkOut) {
            return res.status(400).json({ message: "checkIn and checkOut are required" });
        }

        // Check if room exists
        const room = await Room.findOne({ _id: roomId }).populate("owner");
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check if booking exists and belongs to the user
        const booking = await Booking.findOne({ _id: bookingId, bookerId: user._id, roomId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Verify room availability
        const bookings = await Booking.find({ roomId, status: { $in: ["active", "pending"] }, _id: { $ne: bookingId } });
        const incomingUpdate = { checkIn: new Date(checkIn).toISOString(), checkOut: new Date(checkOut).toISOString() };
        const result = processBooking(bookings, incomingUpdate);

        if (result.roomAvailable) {
            // Recalculate room's total hours and revenue
            room.total_hours_booked -= booking.duration;
            room.revenue -= booking.fees;
            await room.save();

            // Calculate the new duration and fees
            const updatedCheckIn = new Date(incomingUpdate.checkIn);
            const updatedCheckOut = new Date(incomingUpdate.checkOut);
            const duration = Math.round(((updatedCheckOut - updatedCheckIn) / 3600000) * 1000) / 1000; // duration in hours
            const fees = room.price_per_hour * duration;

            const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { ...incomingUpdate, duration, fees }, { new: true });

            // Update room's total hours and revenue
            room.total_hours_booked += updatedBooking.duration;
            room.revenue += updatedBooking.fees;
            await room.save();

            // Notify the user (booker)
            const text = `Booking for room ${room.name} has been updated. New check-in: ${new Date(updatedBooking.checkIn).toISOString()} and new check-out: ${new Date(updatedBooking.checkOut).toISOString()}`;
            const subject = "Booking Updated";
            await notifyUser(user, text, subject);

            // Notify the room owner
            const ownerText = `Booking for your room ${room.name} has been updated. New check-in: ${new Date(updatedBooking.checkIn).toISOString()} and new check-out: ${new Date(updatedBooking.checkOut).toISOString()}`;
            await notifyUser(room.owner, ownerText, subject);

            return res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
        } else {
            return res.status(409).json({ message: "Room unavailable", availableDates: result.availableDates });
        }
    } catch (error) {
        next(error);
    }
});

export default bookersRouter