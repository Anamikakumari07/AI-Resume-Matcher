const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    matchResumeWithJob,
} = require("../controllers/jobMatchController");


// =====================================================
// MATCH RESUME WITH JOBS
// POST /api/job-match/match
// =====================================================

router.post(
    "/match",
    authMiddleware,
    matchResumeWithJob
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;