import express from 'express'
import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'

const userRouter = express.Router()

userRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body
        await User.deleteOne({ email })
        const user = await User.create({ email, password, name, phone })
        if (user) {
            generateToken(res, user._id)
        }
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            message: "User created successfully",
        })
    } catch (error) {
        next(error)
    }
})

userRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.matchPasswords(password))) {
            generateToken(res, user._id);
            return res.status(200).json({
                name: user.name,
                email: user.email,
                message: "Logged in successfully."
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password." });
        }

    } catch (error) {
        next(error);
    }
})


userRouter.post('/logout', async (req, res, next) => {
    const token = req.cookies.lh_token;

    if (!token) {
        return res.status(200).json({ message: "No active session to log out from." });
    }

    res.cookie("lh_token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({ message: "Logged out successfully." });
})

userRouter.post("/send-otp", async (req, res, next) => {
    try {
    } catch (error) {
        next(error)
    }
})

userRouter.patch("/reset-password", async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email?.trim() || !oldPassword?.trim() || !newPassword?.trim()) {
            return res.status(400).json({ message: "Email, old password, and new password are required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // send and validate verification code sent to PHONE and EMAIL 

        const match = await user.matchPasswords(oldPassword);
        if (!match) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        next(error);
    }
})

export default userRouter
