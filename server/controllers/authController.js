const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// Register User
// =========================
const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// =========================
// Login User
// =========================
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// =========================
// Get Logged In User
// =========================
const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// =========================
// Update Profile
// =========================
const updateProfile = async (req, res) => {
    try {

        const { name, email } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
};