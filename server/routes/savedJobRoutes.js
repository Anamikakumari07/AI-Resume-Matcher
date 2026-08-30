const express = require("express");

const router = express.Router();

const {
    saveJob,
    getSavedJobs,
    deleteSavedJob,
    checkSavedJob,
} = require("../controllers/savedJobController");

const authMiddleware = require("../middleware/authMiddleware");


// ======================================
// SAVE JOB
// POST /api/saved-jobs/save
// ======================================
router.post(
    "/save",
    authMiddleware,
    saveJob
);


// ======================================
// GET SAVED JOBS
// GET /api/saved-jobs
// ======================================
router.get(
    "/",
    authMiddleware,
    getSavedJobs
);


// ======================================
// CHECK SAVED JOB
// GET /api/saved-jobs/check
// ======================================
router.get(
    "/check",
    authMiddleware,
    checkSavedJob
);


// ======================================
// DELETE SAVED JOB
// DELETE /api/saved-jobs/:id
// ======================================
router.delete(
    "/:id",
    authMiddleware,
    deleteSavedJob
);


module.exports = router;