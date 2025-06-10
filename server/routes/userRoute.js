import express from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { getProfile } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/:username", protectedRoute, getProfile)

export default userRouter