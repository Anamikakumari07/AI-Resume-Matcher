const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getAllResumes,
    deleteUser,
    deleteResume,
    getAdminStats,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Dashboard Stats
router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    getAdminStats
);

// All Users
router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

// All Resumes
router.get(
    "/resumes",
    authMiddleware,
    adminMiddleware,
    getAllResumes
);

// Delete User
router.delete(
    "/user/:id",
    authMiddleware,
    adminMiddleware,
    deleteUser
);

// Delete Resume
router.delete(
    "/resume/:id",
    authMiddleware,
    adminMiddleware,
    deleteResume
);

module.exports = router;