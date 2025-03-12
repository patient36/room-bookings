import express from 'express'
import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'
import sendSMS from '../utils/sns.js'
import sendEmail from '../utils/ses.js'
import { sendOTP, verifyOTP } from '../utils/OTP.js'

const authRouter = express.Router()

async function notifyUser(user, message, subject) {
    await sendSMS(user.phone, message);
    await sendEmail(user.email, message, subject);
}

authRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body

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

authRouter.post("/login", async (req, res, next) => {
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


authRouter.post('/logout', async (req, res, next) => {
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

authRouter.post('/send-otp', async (req, res, next) => {
    try {
        const { phone, email } = req.body

        if (!phone?.trim() || !email?.trim()) {
            return res.status(400).json({ message: "Phone number and email are required." });
        }

        // Find the user
        const user = await User.findOne({ email})
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const OTP = await sendOTP(email)

        const message = `Hello, Your verification code for LOYALTY HAVEN is: ${OTP.otp}. Please use this code to complete your verification process. Thank you for choosing LOYALTY HAVEN!`
        const subject = "LOYALTY HAVEN - Verification Code"

        await notifyUser(user, message, subject)
        res.status(200).json({ message: "OTP sent" })
    } catch (error) {
        next(error)
    }
})

authRouter.patch("/reset-password", async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword, OTP } = req.body;

        // Validate input
        if (!email?.trim() || !oldPassword?.trim() || !newPassword?.trim() || !OTP?.trim()) {
            return res.status(400).json({ message: "Email, old password, new password, and OTP are required." });
        }

        // Verify OTP
        const isValid = await verifyOTP(email, OTP);
        if (!isValid.success) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // Find the user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify old password
        const isOldPasswordValid = await user.matchPasswords(oldPassword);

        if (!isOldPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        // Update password
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        next(error);
    }
});

export default authRouter