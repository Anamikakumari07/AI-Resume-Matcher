const express = require("express");
const router = express.Router();

const {
    uploadResume,
    parseResumeWithAI,
    getMyResumes,
    deleteResume,
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// =====================================================
// UPLOAD RESUME
// POST /api/resume/upload
// =====================================================

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);


// =====================================================
// PARSE / ANALYZE RESUME
// POST /api/resume/parse
// =====================================================

router.post(
    "/parse",
    authMiddleware,
    upload.single("resume"),
    parseResumeWithAI
);


// =====================================================
// GET MY RESUMES
// GET /api/resume/my-resumes
// =====================================================

router.get(
    "/my-resumes",
    authMiddleware,
    getMyResumes
);


// =====================================================
// DELETE RESUME
// DELETE /api/resume/:id
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    deleteResume
);


module.exports = router;