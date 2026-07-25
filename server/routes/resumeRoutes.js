const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
    uploadResume,
    getMyResumes
} = require("../controllers/resumeController");

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/my-resumes",
    authMiddleware,
    getMyResumes
);

module.exports = router;