import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email Format" })
        }

        const existingUserEmail = await User.findOne({ email })
        const existingUserName = await User.findOne({ username })
        if (existingUserEmail || existingUserName) {
            return res.status(400).json({ error: "User Already Exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password can't be less than 6" })
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(200).json({ message: "User Created Successfully", user: newUser })
        } else {
            res.status(400).json({ message: "Invalid User Data" })
        }
    } catch (error) {
        console.log(`Error in Signup Controller ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}
