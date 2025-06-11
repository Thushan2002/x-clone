import express from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { followUnfollowUser, getProfile, suggestedUsers } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/suggested", protectedRoute, suggestedUsers)
userRouter.get("/:username", protectedRoute, getProfile)
userRouter.post("/follow/:id", protectedRoute, followUnfollowUser)


export default userRouter