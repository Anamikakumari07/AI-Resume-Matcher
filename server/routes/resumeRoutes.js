const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const authMiddleware = require("../middleware/authMiddleware");

const {
    uploadResume,
    getMyResumes,
    getResumeById,
    deleteResume,
} = require("../controllers/resumeController");

// Upload Resume
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

// Get All User Resumes
router.get(
    "/my-resumes",
    authMiddleware,
    getMyResumes
);

// Get Resume By ID
router.get(
    "/:id",
    authMiddleware,
    getResumeById
);

// Delete Resume
router.delete(
    "/:id",
    authMiddleware,
    deleteResume
);

module.exports = router;