import Notification from "../models/notificationModel.js";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ error: "Invalid Username" })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(`Error in getProfile Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToModify = await User.findById({ _id: id })
        const currentUser = await User.findById({ _id: req.user._id })

        if (id === req.user._id) {
            return res.status(400).json({ error: "You can't follow or unfollow Yourself" })
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not Found" })
        }

        const isFollowing = await currentUser.following.includes(id)

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate({ _id: id }, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { following: id } })
            return res.status(200).json({ message: "You Unfollowed the User" })
        } else {
            // follow
            await User.findByIdAndUpdate({ _id: id }, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate({ _id: req.user._id }, { $push: { following: id } })
            // notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save()
            return res.status(200).json({ message: "You Followed the User" })
        }
    } catch (error) {
        console.log(`Error in followUnfollowUser Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}