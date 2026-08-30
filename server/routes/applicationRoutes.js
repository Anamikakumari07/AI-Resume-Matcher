const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    applyJob,
    getMyApplications,
    deleteApplication,
    getApplicationStats,
} = require(
    "../controllers/applicationController"
);


// =====================================================
// APPLY
// =====================================================

router.post(
    "/apply",
    authMiddleware,
    applyJob
);


// =====================================================
// MY APPLICATIONS
// =====================================================

router.get(
    "/my-applications",
    authMiddleware,
    getMyApplications
);


// =====================================================
// STATS
// =====================================================

router.get(
    "/stats",
    authMiddleware,
    getApplicationStats
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    deleteApplication
);


module.exports = router;