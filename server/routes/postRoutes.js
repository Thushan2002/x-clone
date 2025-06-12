import express, { Router } from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { createPost, deletePost } from "../controllers/postController.js"

const postRouter = express.Router()

postRouter.post("/create", protectedRoute, createPost)
postRouter.delete("/delete/:id", protectedRoute, deletePost)

export default postRouter