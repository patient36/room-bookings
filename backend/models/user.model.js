import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email is already in use"],
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false
        },
        accountType: {
            type: String,
            enum: ["booker", "owner", "admin"],
            default: "booker",
        },
        accountStatus: {
            type: String,
            enum: ["active", "banned", "dormant"],
            default: "active",
        },
        bookings: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
            default: [],
        },
        rooms: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
            default: [],
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
            trim: true,
            match: [/^\+[1-9]\d{1,14}$/, "Phone number must start with '+' followed by 2-15 digits"],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema);

export default User;
