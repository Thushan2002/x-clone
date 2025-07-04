import Notification from "../models/notificationModel.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary"

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

export const suggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id
        const userFollowedByMe = await User.findById({ _id: userId }).select("-password")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            }, {
                $sample: {
                    size: 10
                }
            }
        ])

        const filteredUsers = users.filter((user) => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4)

        suggestedUsers.forEach(user => {
            user.password = null
        });
        return res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log(`Error in suggestedUsers Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }

}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, fullName, email, currentPassword, newPassword, bio, link } = req.body
        let { profileImg, coverImg } = req.body
        let user = await User.findById({ _id: userId })
        if (!user) {
            return res.status(400).json({ error: "User not Found" })
        }
        if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ error: "Please Provide both new and current Passwords" })
        }
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({ error: "Current Password is incorrect" })
            }
            if (newPassword < 6) {
                return res.status(400).json({ error: "New Password can't be less than 6 characters" })
            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }
        // if (profileImg) {
        //     if (user.profileImg) {
        //         await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(profileImg)
        //     profileImg = uploadedResponse.secure_url;
        // }
        // if (coverImg) {
        //     if (user.coverImg) {
        //         await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(coverImg)
        //     coverImg = uploadedResponse.secure_url;
        // }

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()

        user.password = null
        return res.status(200).json({ message: "Updated Successfully", user })

    } catch (error) {
        console.log(`Error in updateUser Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}