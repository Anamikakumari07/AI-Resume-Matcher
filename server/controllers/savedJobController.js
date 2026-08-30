const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

// ======================================
// SAVE JOB
// POST /api/saved-jobs/save
// ======================================
const saveJob = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("======================================");
        console.log("SAVE JOB REQUEST");
        console.log("USER ID:", userId);
        console.log("REQUEST BODY:", req.body);
        console.log("======================================");

        const {
            jobId,
            title,
            company,
            location,
            matchPercentage,
            matchingSkills,
            missingSkills,
            analysis
        } = req.body;

        // --------------------------------------
        // Validate job ID
        // --------------------------------------

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // --------------------------------------
        // Find actual Job document
        // --------------------------------------

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        console.log("JOB FOUND:", job._id);
        console.log("JOB TITLE:", job.title);

        // --------------------------------------
        // Check duplicate
        // --------------------------------------

        const existingSavedJob = await SavedJob.findOne({
            user: userId,
            job: job._id
        });

        if (existingSavedJob) {
            return res.status(400).json({
                success: false,
                message: "Job already saved"
            });
        }

        // --------------------------------------
        // Create saved job
        // --------------------------------------

        const savedJob = await SavedJob.create({
            user: userId,

            job: job._id,

            matchPercentage:
                Number(matchPercentage) || 0,

            matchingSkills:
                Array.isArray(matchingSkills)
                    ? matchingSkills
                    : [],

            missingSkills:
                Array.isArray(missingSkills)
                    ? missingSkills
                    : [],

            analysis:
                analysis || ""
        });

        console.log("======================================");
        console.log("JOB SAVED SUCCESSFULLY");
        console.log("SAVED JOB ID:", savedJob._id);
        console.log("JOB ID:", job._id);
        console.log("======================================");

        return res.status(201).json({
            success: true,
            message: "Job saved successfully",
            savedJob
        });

    } catch (error) {

        console.error("======================================");
        console.error("SAVE JOB ERROR");
        console.error(error);
        console.error("======================================");

        return res.status(500).json({
            success: false,
            message: "Failed to save job",
            error: error.message
        });
    }
};


// ======================================
// GET SAVED JOBS
// GET /api/saved-jobs
// ======================================
const getSavedJobs = async (req, res) => {
    try {

        const userId = req.user.id;

        console.log("======================================");
        console.log("GET SAVED JOBS");
        console.log("USER ID:", userId);
        console.log("======================================");

        const savedJobs = await SavedJob.find({
            user: userId
        })
        .populate("job")
        .sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: savedJobs.length,
            savedJobs
        });

    } catch (error) {

        console.error("GET SAVED JOBS ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch saved jobs",
            error: error.message
        });
    }
};


// ======================================
// DELETE SAVED JOB
// DELETE /api/saved-jobs/:id
// ======================================
const deleteSavedJob = async (req, res) => {
    try {

        const userId = req.user.id;
        const { id } = req.params;

        console.log("======================================");
        console.log("DELETE SAVED JOB");
        console.log("USER ID:", userId);
        console.log("SAVED JOB ID:", id);
        console.log("======================================");

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Saved job ID is required"
            });
        }

        const deletedJob = await SavedJob.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!deletedJob) {
            return res.status(404).json({
                success: false,
                message: "Saved job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job removed from saved jobs",
            deletedJob
        });

    } catch (error) {

        console.error("DELETE SAVED JOB ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete saved job",
            error: error.message
        });
    }
};


// ======================================
// CHECK SAVED JOB
// GET /api/saved-jobs/check
// ======================================
const checkSavedJob = async (req, res) => {
    try {

        const userId = req.user.id;

        const { jobId } = req.query;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        const savedJob = await SavedJob.findOne({
            user: userId,
            job: jobId
        })
        .populate("job");

        return res.status(200).json({
            success: true,
            isSaved: !!savedJob,
            savedJob: savedJob || null
        });

    } catch (error) {

        console.error("CHECK SAVED JOB ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to check saved job",
            error: error.message
        });
    }
};


// ======================================
// EXPORT
// ======================================

module.exports = {
    saveJob,
    getSavedJobs,
    deleteSavedJob,
    checkSavedJob
};