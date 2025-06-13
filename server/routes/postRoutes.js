import express, { Router } from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { createPost, deletePost, likeAndDislike, postComment } from "../controllers/postController.js"

const postRouter = express.Router()

postRouter.post("/create", protectedRoute, createPost)
postRouter.delete("/delete/:id", protectedRoute, deletePost)
postRouter.post("/comment/:id", protectedRoute, postComment)
postRouter.post("/like/:id", protectedRoute, likeAndDislike)

export default postRouter