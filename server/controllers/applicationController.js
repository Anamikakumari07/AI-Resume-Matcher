const Application = require("../models/Application");

// Apply Job
const applyJob = async (req, res) => {

    try {

        const {
            company,
            position,
            location,
            salary,
            jobType,
        } = req.body;

        const application = await Application.create({

            user: req.user.id,

            company,

            position,

            location,

            salary,

            jobType,

        });

        res.status(201).json({

            success: true,

            message: "Application Submitted Successfully",

            application,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// Get Applications
const getMyApplications = async (req, res) => {

    try {

        const applications = await Application.find({

            user: req.user.id,

        }).sort({

            createdAt: -1,

        });

        res.status(200).json({

            success: true,

            applications,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// Delete
const deleteApplication = async (req, res) => {

    try {

        await Application.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Application Deleted",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// Dashboard Stats
const getApplicationStats = async (req, res) => {

    try {

        const totalApplications = await Application.countDocuments({

            user: req.user.id,

        });

        res.status(200).json({

            success: true,

            totalApplications,

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

    applyJob,

    getMyApplications,

    deleteApplication,

    getApplicationStats,

};