import express from "express"
import { getMe, login, logout, signUp } from "../controllers/authController.js"
import protectedRoute from "../middleware/protectedRoutes.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.get("/me", protectedRoute, getMe)

export default authRouter