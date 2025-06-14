import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary"

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body

        const userId = req.user._id
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ error: "User not Found" })
        }

        if (!text && !img) {
            return res.status(400).json({ error: "Post can't be Empty" })
        }
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        return res.status(200).json(newPost)

    } catch (error) {
        console.log(`Error in createPost Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findOne({ _id: id })
        if (!post) {
            return res.status(404).json({ error: "Post not Found" })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: "You're not Authorise to delete this post" })
        }
        if (post.img) {
            await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0])
        }
        await Post.findByIdAndDelete({ _id: id })
        return res.status(200).json({ message: "Post Deleted" })

    } catch (error) {
        console.log(`Error in deletePost Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const postComment = async (req, res) => {
    try {
        const { id } = req.params
        const { text } = req.body
        const post = await Post.findById({ _id: id })
        if (!post) {
            return res.status(404).json({ error: "Post not Found" })
        }
        const comment = {
            text,
            user: req.user._id
        }
        post.comments.push(comment)
        await post.save()
        const newNotification = new Notification({
            type: "comment",
            from: req.user._id,
            to: post.user
        })
        await newNotification.save()
        return res.status(200).json({ message: "Comment Posted", post })
    } catch (error) {
        console.log(`Error in postComment Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const likeAndDislike = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id
        const post = await Post.findById({ _id: id })
        if (!post) {
            return res.status(404).json({ error: "Post not Found" })
        }
        const isAlreadyLiked = await post.likes.includes(userId)
        if (!isAlreadyLiked) {
            await Post.findByIdAndUpdate({ _id: id }, { $push: { likes: userId } })
            await User.findByIdAndUpdate({ _id: userId }, { $push: { likedPosts: id } })
            return res.status(200).json({ message: "You Liked the post" })
        }
        await Post.findByIdAndUpdate({ _id: id }, { $pull: { likes: userId } })
        await User.findByIdAndUpdate({ _id: userId }, { $pull: { likedPosts: id } })
        await post.save()

        // notifiaction
        const newNotification = new Notification({
            type: "like",
            from: userId,
            to: post.user
        })
        await newNotification.save()
        return res.status(200).json({ message: "You Unliked the post" })


    } catch (error) {
        console.log(`Error in likeAndDislike Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const { userId } = req.user._id
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: ["-password", "-email", "-following", "-followers", "-bio", "-link"]
        })
        if (posts.length === 0) {
            return res.status(404).json([])
        }
        return res.status(200).json({ message: "Fetched Succfully", posts })

    } catch (error) {
        console.log(`Error in getAllPosts Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById({ _id: userId })
        if (!userId) {
            return res.status(404).json({ error: "No user found" })
        }
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: ["-password", "-email", "-following", "-followers", "-bio", "-link"]
        })
        if (!likedPosts) {
            return res.status(404).json({ error: "You doesn't liked any posts" })
        }
        res.status(200).json({ message: "Your Liked Posts", likedPosts })
    } catch (error) {
        console.log(`Error in getLikedPosts Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById({ _id: userId })
        if (!user) {
            return res.status(404).json({ error: "No user found" })
        }
        const following = user.following;
        const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: ["-password", "-email", "-following", "-followers", "-bio", "-link"]
        })
        if (!feedPosts) {
            return res.status(404).json({ error: "No Feed Posts found" })
        }
        res.status(200).json(feedPosts)
    } catch (error) {
        console.log(`Error in getFollowingPosts Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

