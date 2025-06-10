import express from "express"
import dotenv from 'dotenv'
import connectDB from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Server Connected")
})

app.use("/api/auth", authRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
    connectDB()
})

