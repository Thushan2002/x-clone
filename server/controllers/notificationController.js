import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: ["username profileImg"]
        })

        await Notification.updateMany({ to: userId }, { read: true })
    } catch (error) {
        console.log(`Error in getNotifications Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id
        await Notification.deleteMany({ to: userId })

        return res.status(200).json({ message: "Notification Deleted" })


    } catch (error) {
        console.log(`Error in deleteNotifications Controller ${error}`);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}