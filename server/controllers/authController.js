const User = require("../models/User");

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: newUser,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    registerUser,
};