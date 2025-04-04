import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        area: {
            type: Number,
            min: [1, "Area must be at least 1 sqm"],
        },
        capacity: {
            type: Number,
            min: [1, "Capacity must be at least 1 person"],
        },
        price_per_hour: {
            type: Number,
            required: true,
            min: [0, "Price per hour cannot be negative"],
        },
        street: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        availability: {
            type: String,
            default: "7:00 AM - 6:00 PM",
        },
        amenities: {
            type: [String],
            default: [],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        total_hours_booked: {
            type: Number,
            default: 0,
            min: [0, "Booking duration cannot be negative"]
        },
        images: [
            {
                type: String,
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive","deleted"],
            default: "inactive",
        },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", roomSchema);

export default Room