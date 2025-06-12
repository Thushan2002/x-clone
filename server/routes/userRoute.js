import express from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { followUnfollowUser, getProfile, suggestedUsers, updateUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/suggested", protectedRoute, suggestedUsers)
userRouter.get("/:username", protectedRoute, getProfile)
userRouter.post("/follow/:id", protectedRoute, followUnfollowUser)
userRouter.post("/update", protectedRoute, updateUser)


export default userRouter