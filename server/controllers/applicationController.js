const Application = require("../models/Application");


// =====================================================
// APPLY TO JOB
// =====================================================

const applyJob = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            jobId,
            company,
            position,
            location,
            salary,
            jobType,
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!company || !position) {

            return res.status(400).json({

                success: false,

                message:
                    "Company and position are required.",

            });

        }


        // =================================================
        // PREVENT DUPLICATE APPLICATION
        // =================================================

        const existingApplication =
            await Application.findOne({

                user: userId,

                company: company,

                position: position,

            });


        if (existingApplication) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already applied to this job.",

                application:
                    existingApplication,

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
                    jobId || null,

                company:
                    company,

                position:
                    position,

                location:
                    location || "",

                salary:
                    salary || "",

                jobType:
                    jobType || "",

                status:
                    "Applied",

            });


        return res.status(201).json({

            success: true,

            message:
                "Application Submitted Successfully",

            application,

        });


    } catch (error) {

        console.error(
            "Apply Job Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

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

        const applications =
            await Application.find({

                user:
                    req.user.id,

            }).sort({

                createdAt:
                    -1,

            });


        return res.status(200).json({

            success: true,

            count:
                applications.length,

            applications,

        });


    } catch (error) {

        console.error(
            "Get Applications Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

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

        const application =
            await Application.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.id,

            });


        if (!application) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found.",

            });

        }


        await application.deleteOne();


        return res.status(200).json({

            success: true,

            message:
                "Application Deleted",

        });


    } catch (error) {

        console.error(
            "Delete Application Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

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

        const totalApplications =
            await Application.countDocuments({

                user:
                    req.user.id,

            });


        return res.status(200).json({

            success: true,

            totalApplications,

        });


    } catch (error) {

        console.error(
            "Application Stats Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

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

    getApplicationStats,

};