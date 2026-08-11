const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadResume,
    parseResumeWithAI,
    getMyResumes,
    deleteResume
} = require("../controllers/resumeController");


// ===============================
// Upload Resume
// ===============================
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);


// ===============================
// Parse Resume with Gemini AI
// ===============================
router.post(
    "/parse",
    authMiddleware,
    upload.single("resume"),
    parseResumeWithAI
);


// ===============================
// Get My Resumes
// ===============================
router.get(
    "/my-resumes",
    authMiddleware,
    getMyResumes
);


// ===============================
// Delete Resume
// ===============================
router.delete(
    "/:id",
    authMiddleware,
    deleteResume
);


module.exports = router;