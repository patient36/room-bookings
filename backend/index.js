import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/error.js";
import authRouter from "./routes/auth.routes.js";
import ownersRouter from "./routes/owners.routes.js";
import bookersRouter from "./routes/bookers.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/owner/rooms', ownersRouter);
app.use('/api/booker/rooms', bookersRouter);
app.use('/api/admin', adminRouter)

app.use(notFound);
app.use(errorHandler);


mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error.message))

app.listen(PORT, () => {
    console.log(`Server is ready on PORT ${PORT}`)
})