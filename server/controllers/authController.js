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


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({ message: "Invalid Username" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Incorrect Password" })
        }

        generateToken(user._id, res)
        res.status(200).json({ message: "Login Successfull", user })
    } catch (error) {
        console.log(`Error in Login Controller ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout Successful" })
    } catch (error) {
        console.log(`Error in Logout Controller ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log(`Error in getMe Controller ${error}`);
        res.status(500).json({ error: "Internal Server Error" })
    }
}