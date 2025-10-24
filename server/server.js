import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

// --- CORS setup first ---
app.use(cors({
    origin: "https://x-clone-vxzx.onrender.com",
    credentials: true,
}));
app.options('*', cors({
    origin: "https://x-clone-vxzx.onrender.com",
    credentials: true,
}));

// --- Middleware ---
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// --- Cloudinary ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Routes ---
app.get("/", (req, res) => res.send("Server Connected"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notification", notificationRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
    connectDB();
});
