const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// =======================
// Register
// =======================
router.post("/register", register);

// =======================
// Login
// =======================
router.post("/login", login);

// =======================
// Logged In User
// =======================
router.get("/me", authMiddleware, getMe);

// =======================
// Update Profile
// =======================
router.put(
    "/update-profile",
    authMiddleware,
    updateProfile
);

module.exports = router;