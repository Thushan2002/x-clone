import express, { urlencoded } from "express"
import dotenv from 'dotenv'
import connectDB from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRoute.js"
import cloudinary from "cloudinary"
import postRouter from "./routes/postRoutes.js"
import notificationRouter from "./routes/notificationRoutes.js"
import cors from "cors"

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.send("Server Connected")
})

// App Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/notification", notificationRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
    connectDB()
})

