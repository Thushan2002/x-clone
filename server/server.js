import express from "express"
import dotenv from 'dotenv'
import connectDB from "./configs/db.js"

dotenv.config()
const app = express()

app.get("/", (req, res) => {
    res.send("Server Connected")
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
    connectDB()
})

