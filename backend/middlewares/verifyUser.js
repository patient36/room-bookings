import User from "../models/user.model.js";

export const isOwner = async (req, res, next) => {
    const userId = req.user._id
    const user = await User.findOne({ _id: userId, accountType: 'owner' })
    if (!user) {
        return res.status(401).json({ message: "User is not a  room owner" })
    }
    req.user = user
    next()
}

export const isBooker = async (req, res, next) => {
    const userId = req.user._id
    const user = await User.findOne({ _id: userId, accountType: 'booker' })
    if (!user) {
        return res.status(401).json({ message: "User is not a booker" })
    }
    req.user = user
    next()
}

export const isAdmin = async (req, res, next) => {
    const userId = req.user._id
    const user = await User.findOne({ _id: userId, accountType: 'admin' })
    if (!user) {
        return res.status(401).json({ message: "User is not a system Admin" })
    }
    req.user = user
    next()
}