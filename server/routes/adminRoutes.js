const express = require("express");

const router =
    express.Router();


const {

    getAllUsers,

    getAllResumes,

    deleteUser,

    deleteResume,

    getAdminStats,

    getAllJobs,

    getJobById,

    createJob,

    updateJob,

    deleteJob,

    getAllApplications,

    updateApplicationStatus,

    deleteApplication,

} = require(
    "../controllers/adminController"
);


const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );


const adminMiddleware =
    require(
        "../middleware/adminMiddleware"
    );


// =====================================================
// ADMIN STATS
// =====================================================

router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    getAdminStats
);


// =====================================================
// USERS
// =====================================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);


router.delete(
    "/user/:id",
    authMiddleware,
    adminMiddleware,
    deleteUser
);


// =====================================================
// RESUMES
// =====================================================

router.get(
    "/resumes",
    authMiddleware,
    adminMiddleware,
    getAllResumes
);


router.delete(
    "/resume/:id",
    authMiddleware,
    adminMiddleware,
    deleteResume
);


// =====================================================
// JOBS
// =====================================================

router.get(
    "/jobs",
    authMiddleware,
    adminMiddleware,
    getAllJobs
);


router.get(
    "/job/:id",
    authMiddleware,
    adminMiddleware,
    getJobById
);


router.post(
    "/job",
    authMiddleware,
    adminMiddleware,
    createJob
);


router.put(
    "/job/:id",
    authMiddleware,
    adminMiddleware,
    updateJob
);


router.delete(
    "/job/:id",
    authMiddleware,
    adminMiddleware,
    deleteJob
);


// =====================================================
// APPLICATIONS
// =====================================================

router.get(
    "/applications",
    authMiddleware,
    adminMiddleware,
    getAllApplications
);


router.put(
    "/application/:id/status",
    authMiddleware,
    adminMiddleware,
    updateApplicationStatus
);


router.delete(
    "/application/:id",
    authMiddleware,
    adminMiddleware,
    deleteApplication
);


module.exports = router;