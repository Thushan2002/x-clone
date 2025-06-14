import express from "express"
import protectedRoute from "../middleware/protectedRoutes.js"
import { deleteNotifications, getNotifications } from "../controllers/notificationController.js"

const notificationRouter = express.Router()

notificationRouter.get("/get", protectedRoute, getNotifications)
notificationRouter.delete("/delete", protectedRoute, deleteNotifications)

export default notificationRouter