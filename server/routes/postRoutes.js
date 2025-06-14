import express, { Router } from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPostsByUsername, likeAndDislike, postComment } from "../controllers/postController.js"

const postRouter = express.Router()

postRouter.get("/allPosts", protectedRoute, getAllPosts)
postRouter.get("/FollowingPosts", protectedRoute, getFollowingPosts)
postRouter.get("/user/:username", protectedRoute, getUserPostsByUsername)
postRouter.get("/likedPosts/:id", protectedRoute, getLikedPosts)
postRouter.post("/create", protectedRoute, createPost)
postRouter.delete("/delete/:id", protectedRoute, deletePost)
postRouter.post("/comment/:id", protectedRoute, postComment)
postRouter.post("/like/:id", protectedRoute, likeAndDislike)

export default postRouter