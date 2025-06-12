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