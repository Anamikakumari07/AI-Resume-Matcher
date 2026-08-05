const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    applyJob,

    getMyApplications,

    deleteApplication,

    getApplicationStats,

} = require("../controllers/applicationController");

router.post(
    "/apply",
    authMiddleware,
    applyJob
);

router.get(
    "/my-applications",
    authMiddleware,
    getMyApplications
);

router.get(
    "/stats",
    authMiddleware,
    getApplicationStats
);

router.delete(
    "/:id",
    authMiddleware,
    deleteApplication
);

module.exports = router;