import express from "express";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();

app.listen(PORT, () => {
    console.log(`Server is ready on PORT :${PORT}`)
})