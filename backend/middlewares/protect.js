import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
    let token;
    token = req.cookies.lh_token

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId)
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not authorized, no token')
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token' })
    }
}

export default protect