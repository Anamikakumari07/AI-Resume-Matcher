const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadResume,
    getMyResumes,
    getResumeById,
} = require("../controllers/resumeController");

// Upload Resume
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

// Get All Resumes of Logged-in User
router.get(
    "/my-resumes",
    authMiddleware,
    getMyResumes
);

// Get Single Resume by ID
router.get(
    "/:id",
    authMiddleware,
    getResumeById
);

module.exports = router;