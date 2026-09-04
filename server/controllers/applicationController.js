const mongoose = require("mongoose");

const Application = require("../models/Application");


// =====================================================
// APPLY TO JOB
// =====================================================

const applyJob = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTH
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        const userId =
            req.user.id;


        const {
            jobId,
            company,
            position,
            location,
            salary,
            jobType
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !jobId
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Job ID is required."

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                jobId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid job ID."

            });

        }


        if (
            !company ||
            !String(company).trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Company is required."

            });

        }


        if (
            !position ||
            !String(position).trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Position is required."

            });

        }


        // =================================================
        // PREVENT DUPLICATE APPLICATION
        // =================================================

        const existingApplication =
            await Application.findOne({

                user:
                    userId,

                jobId:
                    jobId

            });


        if (
            existingApplication
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already applied to this job.",

                application:
                    existingApplication

            });

        }


        // =================================================
        // CREATE APPLICATION
        // =================================================

        const application =
            await Application.create({

                user:
                    userId,

                jobId:
                    jobId,

                company:
                    String(company).trim(),

                position:
                    String(position).trim(),

                location:
                    location
                        ? String(location).trim()
                        : "",

                salary:
                    salary
                        ? String(salary).trim()
                        : "",

                jobType:
                    jobType
                        ? String(jobType).trim()
                        : "",

                status:
                    "Applied"

            });


        return res.status(201).json({

            success: true,

            message:
                "Application submitted successfully.",

            application

        });


    } catch (error) {

        console.error(
            "Apply Job Error:",
            error.message
        );


        // =================================================
        // DUPLICATE KEY
        // =================================================

        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already applied to this job."

            });

        }


        if (
            error instanceof mongoose.Error.ValidationError
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application data."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Unable to submit application."

        });

    }

};


// =====================================================
// GET MY APPLICATIONS
// =====================================================

const getMyApplications = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTH
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        // =================================================
        // GET APPLICATIONS
        // =================================================

        const applications =
            await Application.find({

                user:
                    req.user.id

            })
                .populate(
                    "jobId"
                )
                .sort({

                    createdAt:
                        -1

                });


        return res.status(200).json({

            success: true,

            count:
                applications.length,

            applications

        });


    } catch (error) {

        console.error(
            "Get Applications Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch applications."

        });

    }

};


// =====================================================
// DELETE MY APPLICATION
// =====================================================

const deleteApplication = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTH
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        // =================================================
        // ID VALIDATION
        // =================================================

        const applicationId =
            req.params.id;


        if (
            !mongoose.Types.ObjectId.isValid(
                applicationId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application ID."

            });

        }


        // =================================================
        // FIND USER'S APPLICATION
        // =================================================

        const application =
            await Application.findOne({

                _id:
                    applicationId,

                user:
                    req.user.id

            });


        if (
            !application
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }


        await application.deleteOne();


        return res.status(200).json({

            success: true,

            message:
                "Application deleted successfully."

        });


    } catch (error) {

        console.error(
            "Delete Application Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete application."

        });

    }

};


// =====================================================
// APPLICATION STATS
// =====================================================

const getApplicationStats = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTH
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        const totalApplications =
            await Application.countDocuments({

                user:
                    req.user.id

            });


        return res.status(200).json({

            success: true,

            totalApplications

        });


    } catch (error) {

        console.error(
            "Application Stats Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch application statistics."

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    applyJob,

    getMyApplications,

    deleteApplication,

    getApplicationStats

};