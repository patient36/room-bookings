import express from "express"
import Room from "../models/room.model.js"
import { isAdmin } from "../middlewares/verifyUser.js"
import protect from "../middlewares/protect.js"

const searchRouter = express.Router()

searchRouter.get("/", async (req, res, next) => {
    try {
        const term = req.query.term?.toString().trim().replace(/\s+/g, " ");

        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }

        const roomQuery = {
            $and: [
                { status: "active" },
                {
                    $or: [
                        { name: { $regex: term, $options: "i" } },
                        { location: { $regex: term, $options: "i" } },
                        { street: { $regex: term, $options: "i" } }
                    ]
                }
            ]
        };


        const rooms = await Room.find(roomQuery).select("name street location images").limit(20).lean()

        res.status(200).json({ rooms });

    } catch (error) {
        next(error);
    }
});

searchRouter.get("/admin", [protect, isAdmin], async (req, res, next) => {
    try {
        const term = req.query.term?.toString().trim().replace(/\s+/g, " ");

        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }

        const roomQuery = {
            $or: [
                { name: { $regex: term, $options: "i" } },
                { location: { $regex: term, $options: "i" } },
                { street: { $regex: term, $options: "i" } }
            ]
        }
        const rooms = await Room.find(roomQuery).select("name street location images status").limit(10).lean()

        res.status(200).json({ rooms, users });

    } catch (error) {
        next(error);
    }
});


export default searchRouter