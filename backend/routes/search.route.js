import express from "express"
import Room from "../models/room.model.js"
import User from "../models/user.model.js"
import { isAdmin } from "../middlewares/verifyUser.js"
import protect from "../middlewares/protect.js"

const searchRouter = express.Router()

searchRouter.get("/", async (req, res, next) => {
    try {
        const term = req.query.term?.toString().trim();

        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }

        const roomQuery = { name: { $regex: term, $options: "i" }, status: "active" };
        const userQuery = { name: { $regex: term, $options: "i" }, accountType: { $ne: "admin" }, accountStatus: "active" };


        const [rooms, users] = await Promise.all([
            Room.find(roomQuery).select("name street location images").limit(10).lean(),
            User.find(userQuery).select("name accountType").limit(10).lean()
        ]);

        res.status(200).json({ rooms, users });

    } catch (error) {
        next(error);
    }
});

searchRouter.get("/admin", [protect, isAdmin], async (req, res, next) => {
    try {
        const term = req.query.term?.toString().trim();

        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }

        const searchQuery = { name: { $regex: term, $options: "i" } };

        const [rooms, users] = await Promise.all([
            Room.find(searchQuery).select("name street location images status").limit(10).lean(),
            User.find(searchQuery).select("name accountType accountStatus").limit(10).lean()
        ]);

        res.status(200).json({ rooms, users });

    } catch (error) {
        next(error);
    }
});


export default searchRouter