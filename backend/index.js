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
import paymentRouter from "./routes/payment.routes.js";
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();

app.use((req, res, next) => {
    if (req.originalUrl === "/api/payments/card/webhook") {
        next();
    } else {
        express.json()(req, res, next);
    }
})
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/redoc.html'));
});

app.use('/api/auth', authRouter);
app.use('/api/owner/rooms', ownersRouter);
app.use('/api/booker/rooms', bookersRouter);
app.use('/api/admin', adminRouter)
app.use('/api/payments', paymentRouter)

app.use(notFound);
app.use(errorHandler);


mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error.message))

app.listen(PORT, () => {
    console.log(`Server is ready on PORT ${PORT}`)
})