const SavedJob = require("../models/SavedJob");

// Save Job
const saveJob = async (req, res) => {

    try {

        const job = await SavedJob.create({

            user: req.user.id,

            company: req.body.company,

            title: req.body.title,

            location: req.body.location,

            matchPercentage: req.body.matchPercentage,

            reason: req.body.reason,

        });

        res.status(201).json({

            success: true,

            message: "Job Saved",

            job,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// My Saved Jobs

const getSavedJobs = async (req, res) => {

    try {

        const jobs = await SavedJob.find({

            user: req.user.id,

        }).sort({

            createdAt: -1,

        });

        res.json({

            success: true,

            jobs,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// Delete Saved Job

const deleteSavedJob = async (req, res) => {

    try {

        await SavedJob.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Removed",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {

    saveJob,

    getSavedJobs,

    deleteSavedJob,

};