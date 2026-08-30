const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required",

            });

        }


        if (
            password.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters long",

            });

        }


        // =================================================
        // NORMALIZE EMAIL
        // =================================================

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        // =================================================
        // CHECK EXISTING USER
        // =================================================

        const existingUser =
            await User.findOne({

                email:
                    normalizedEmail,

            });


        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "User already exists",

            });

        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // =================================================
        // CREATE USER
        // =================================================

        const user =
            await User.create({

                name:
                    name.trim(),

                email:
                    normalizedEmail,

                password:
                    hashedPassword,

            });


        // =================================================
        // CREATE TOKEN
        // =================================================

        const token =
            jwt.sign(

                {
                    id:
                        user._id,

                    role:
                        user.role,

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d",
                }

            );


        return res.status(201).json({

            success: true,

            message:
                "User Registered Successfully",

            token,

            user: {

                _id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

            },

        });


    } catch (error) {

        console.log(
            "Register Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// LOGIN USER
// =====================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password,
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and Password are required",

            });

        }


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        // =================================================
        // FIND USER
        // =================================================

        const user =
            await User.findOne({

                email:
                    normalizedEmail,

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        // =================================================
        // CHECK PASSWORD
        // =================================================

        const isMatch =
            await bcrypt.compare(

                password,

                user.password

            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Password",

            });

        }


        // =================================================
        // CREATE TOKEN
        // =================================================

        const token =
            jwt.sign(

                {
                    id:
                        user._id,

                    role:
                        user.role,

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d",
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Login Successful",

            token,

            user: {

                _id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

            },

        });


    } catch (error) {

        console.log(
            "Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// GET LOGGED-IN USER
// =====================================================

const getMe = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTH CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        // =================================================
        // FIND USER
        // =================================================

        const user =
            await User.findById(
                req.user.id
            )
            .select(
                "-password"
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        return res.status(200).json({

            success: true,

            user,

        });


    } catch (error) {

        console.log(
            "Get Me Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (
    req,
    res
) => {

    try {

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        const {
            name,
            email,
        } = req.body;


        // =================================================
        // FIND CURRENT USER
        // =================================================

        const user =
            await User.findById(
                req.user.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        // =================================================
        // NAME VALIDATION
        // =================================================

        if (
            name !== undefined &&
            !String(name).trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name cannot be empty",

            });

        }


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        let newEmail =
            user.email;


        if (
            email !== undefined
        ) {

            newEmail =
                String(
                    email
                )
                    .trim()
                    .toLowerCase();


            if (
                !newEmail
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email cannot be empty",

                });

            }


            // Check whether another account
            // already uses this email.

            const existingUser =
                await User.findOne({

                    email:
                        newEmail,

                    _id: {
                        $ne:
                            user._id,
                    },

                });


            if (existingUser) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This email is already being used by another account",

                });

            }

        }


        // =================================================
        // UPDATE
        // =================================================

        if (
            name !== undefined
        ) {

            user.name =
                String(
                    name
                ).trim();

        }


        user.email =
            newEmail;


        await user.save();


        // =================================================
        // RETURN USER WITHOUT PASSWORD
        // =================================================

        const updatedUser =
            await User.findById(
                user._id
            )
            .select(
                "-password"
            );


        return res.status(200).json({

            success: true,

            message:
                "Profile Updated Successfully",

            user:
                updatedUser,

        });


    } catch (error) {

        console.log(
            "Update Profile Error:",
            error
        );


        // Duplicate email
        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This email is already being used",

            });

        }


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    register,

    login,

    getMe,

    updateProfile,

};