import express from "express"
import User from "../models/user.model.js"
import Room from "../models/room.model.js"
import upload from "../middlewares/upload.js"
import protect from "../middlewares/protect.js"
import { deleteFileFromS3ByUrl } from "../middlewares/deleteFile.js"

const ownersRouter = express.Router()

// Get all of my rooms
ownersRouter.get('/my-rooms', async (req, res, next) => {
    try {
        const userId = req.query.user
        if (!userId) {
            return res.status(400).json({ message: "userId is required" })
        }
        const user = await User.findOne({ _id: userId, accountType: 'owner' })
        if (!user) {
            return res.status(400).json({ message: "User is not registered as a room owner" })
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const totalRooms = await Room.countDocuments({ owner: userId })
        const totalPages = Math.ceil(totalRooms / limit)
        if (page > totalPages) {
            let rooms = []
            return res.status(200).json({
                meta: {
                    user: user.name,
                    totalPages,
                    pageSize: pending.length,
                    page,
                    message: "page not found"
                },
                data: {
                    rooms
                }
            })
        }


        const rooms = await Room.find({ owner: userId }).skip(skip).limit(limit)
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
        })
    } catch (error) {
        next(error)
    }
})

// Get one room 
ownersRouter.get('/:id', async (req, res, next) => {
    try {
        const roomId = req.params.id
        const userId = req.query.user
        if (!userId) {
            return res.status(400).json({ message: "userId is required" })
        }
        const user = await User.findOne({ _id: userId, accountType: 'owner' })
        if (!user) {
            return res.status(400).json({ message: "User is not registered as a room owner" })
        }
        const room = await Room.findOne({ _id: roomId, owner: userId })
        res.status(200).json({ room })
    } catch (error) {
        next(error)
    }
})

// Create a room
ownersRouter.post('/create', upload.fields([{ name: "room_image", minCount: 1 }]), async (req, res) => {
    try {
        const userId = req.query.user
        const { name, description, area, capacity, price_per_hour, street, location, amenities } = req.body
        const room_images = []
        const files = req.files.room_image
        if (files) {
            for (let i = 0; i < files.length; i++) {
                room_images.push(files[i].location)
            }
        }
        if (!userId) {
            room_images.forEach(async (img) => {
                await deleteFileFromS3ByUrl(img)
            })
            return res.status(400).json({ message: "userId is required" })
        }
        const user = await User.findOne({ _id: userId, accountType: 'owner' })
        if (!user) {
            room_images.forEach(async (img) => {
                await deleteFileFromS3ByUrl(img)
            })
            return res.status(400).json({ message: "User is not registered as a room owner" })
        }
        const room = await Room.create({ name, description, area, capacity, price_per_hour, street, location, amenities: amenities.split(","), owner: userId, images: room_images })

        res.status(201).json({ message: 'Room created successfully', room_images });
    } catch (error) {
        throw error
    }
});

export default ownersRouter