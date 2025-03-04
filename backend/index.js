import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error.message))

app.listen(PORT, () => {
    console.log(`Server is ready on PORT ${PORT}`)
})