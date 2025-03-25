import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Booker's user _id is required"]
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Room's _id is required"]
    },
    status: {
        type: String,
        trim: true,
        enum: ["pending", "cancelled", "completed", "active"],
        default: "pending"
    },
    checkIn: {
        type: Date,
        required: [true, "checkIn date is required"],
        validate: {
            validator: function (v) {
                return v >= new Date()
            },
            message: "checkIn can not be a past date"
        }
    },
    checkOut: {
        type: Date,
        required: [true, "checkOut date is required"],
        validate: {
            validator: function (v) {
                return v > this.checkIn;
            },
            message: "checkOut must be after checkIn",
        },
    },
    duration: {
        type: Number,
        default: function () {
            return this.checkIn && this.checkOut
                ? Math.round(((this.checkOut - this.checkIn) / 3600000) * 1000) / 1000
                : 0;
        },
    },
    fees: {
        type: Number,
        default: 0,
        min: [0, "Fees cannot be negative"],
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }
}, {
    timestamps: true
})

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking