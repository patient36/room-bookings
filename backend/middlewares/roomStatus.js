import Room from "../models/room.model.js"
import Booking from "../models/booking.model.js"
import processBooking from "../utils/processBooking.js"

export const isActive = async (req, res, next) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }

        const room = await Room.findOne({ _id: roomId }).populate("owner");

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.status !== "active") {
            return res.status(403).json({ message: "Room is currently inactive. Please try again later" });
        }

        if (!room.owner || room.owner.accountType !== "owner") {
            return res.status(422).json({ message: "Room is inaccessible, it is still under review." });
        }
        req.room = room
        next();
    } catch (error) {
        console.error("Error checking room status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const isAvailable = async (req, res, next) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;
        if (!roomId || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Room ID, checkIn, and checkOut are required" });
        }
        const bookings = await Booking.find({ roomId });
        if (bookings.length === 0) {
            req.roomAvailable = true;
            return next();
        }

        const isRoomAvailable = processBooking(bookings, { checkIn, checkOut });
        if (isRoomAvailable.roomAvailable) {
            return next();
        }
        return res.status(409).json({ message: "Room unavailable", availableDates: isRoomAvailable.availableDates });

    } catch (error) {
        console.error("Error checking room availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
