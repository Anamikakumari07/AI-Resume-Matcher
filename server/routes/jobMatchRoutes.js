const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    matchResumeWithJob,
} = require("../controllers/jobMatchController");

router.post(
    "/match",
    authMiddleware,
    matchResumeWithJob
);

module.exports = router;