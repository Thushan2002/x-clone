import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            res.status(400).json({ error: "Unauthorised: No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            res.status(400).json({ error: "Unauthorised: Token Invalid" })
        }

        const user = await User.findOne({ _id: decoded.userId }).select("-password")
        if (!user) {
            res.status(400).json({ error: "No User Found" })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(`Error in protectedRoute Middleware ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export default protectedRoute