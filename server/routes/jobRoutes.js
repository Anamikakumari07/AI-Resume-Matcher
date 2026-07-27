const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createJob,
    getAllJobs,
    getJobById,
    matchJobs,
} = require("../controllers/jobController");

// Create Job
router.post("/", createJob);

// Get All Jobs
router.get("/", getAllJobs);

// Match Resume with Jobs
router.get("/match", authMiddleware, matchJobs);

// Get Job By ID
router.get("/:id", getJobById);

module.exports = router;