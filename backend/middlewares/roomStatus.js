import Room from "../models/room.model.js"

export const isActive = async (req, res, next) => {
    const roomId = req.body.roomId
    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required" })
    }
    const room = await Room.findOne({ _id: roomId, status: "active" })
    if (!room) {
        return res.status(403).json({ message: "Room is currently inactive. Please try again later" })
    }
    next()
}