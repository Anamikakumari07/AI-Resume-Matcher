const User = require("../models/User");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Application = require("../models/Application");


// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {

    try {

        const users =
            await User.find()
                .select("-password")
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({

            success: true,

            count:
                users.length,

            users,

        });

    } catch (error) {

        console.error(
            "Get All Users Error:",
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
// GET ALL RESUMES
// =====================================================

const getAllResumes = async (req, res) => {

    try {

        const resumes =
            await Resume.find()
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({

            success: true,

            count:
                resumes.length,

            resumes,

        });

    } catch (error) {

        console.error(
            "Get All Resumes Error:",
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
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }

        await Resume.deleteMany({

            user:
                user._id,

        });

        await Application.deleteMany({

            user:
                user._id,

        });

        await user.deleteOne();

        return res.status(200).json({

            success: true,

            message:
                "User deleted successfully",

        });

    } catch (error) {

        console.error(
            "Delete User Error:",
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
// DELETE RESUME
// =====================================================

const deleteResume = async (req, res) => {

    try {

        const resume =
            await Resume.findById(
                req.params.id
            );

        if (!resume) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume not found",

            });

        }

        await resume.deleteOne();

        return res.status(200).json({

            success: true,

            message:
                "Resume deleted successfully",

        });

    } catch (error) {

        console.error(
            "Delete Resume Error:",
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
// ADMIN DASHBOARD STATS
// =====================================================

const getAdminStats = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalResumes =
            await Resume.countDocuments();

        const totalJobs =
            await Job.countDocuments();

        const totalApplications =
            await Application.countDocuments();

        const resumes =
            await Resume.find();

        let averageATS = 0;

        if (
            resumes.length > 0
        ) {

            const totalScore =
                resumes.reduce(
                    (
                        sum,
                        resume
                    ) =>
                        sum +
                        (
                            Number(
                                resume.atsScore
                            ) || 0
                        ),
                    0
                );

            averageATS =
                Number(
                    (
                        totalScore /
                        resumes.length
                    ).toFixed(2)
                );

        }

        return res.status(200).json({

            success: true,

            stats: {

                totalUsers,

                totalResumes,

                totalJobs,

                totalApplications,

                averageATS,

            },

        });

    } catch (error) {

        console.error(
            "Get Admin Stats Error:",
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
// GET ALL JOBS
// =====================================================

const getAllJobs = async (req, res) => {

    try {

        const jobs =
            await Job.find()
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({

            success: true,

            count:
                jobs.length,

            jobs,

        });

    } catch (error) {

        console.error(
            "Get All Jobs Error:",
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
// GET ONE JOB
// =====================================================

const getJobById = async (req, res) => {

    try {

        const job =
            await Job.findById(
                req.params.id
            );

        if (!job) {

            return res.status(404).json({

                success: false,

                message:
                    "Job not found",

            });

        }

        return res.status(200).json({

            success: true,

            job,

        });

    } catch (error) {

        console.error(
            "Get Job Error:",
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
// CREATE JOB
// =====================================================

const createJob = async (req, res) => {

    try {

        const {
            title,
            company,
            location,
            description,
            skills,
            requirements,
            salary,
            type,
            applyUrl,
        } = req.body;

        if (
            !title ||
            !company
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Job title and company are required",

            });

        }

        const job =
            await Job.create({

                title:
                    title.trim(),

                company:
                    company.trim(),

                location:
                    location || "",

                description:
                    description || "",

                skills:
                    Array.isArray(
                        skills
                    )
                        ? skills
                        : typeof skills ===
                          "string"
                        ? skills
                            .split(",")
                            .map(
                                skill =>
                                    skill.trim()
                            )
                            .filter(
                                Boolean
                            )
                        : [],

                requirements:
                    requirements || "",

                salary:
                    salary || "",

                type:
                    type || "",

                applyUrl:
                    applyUrl || "",

            });

        return res.status(201).json({

            success: true,

            message:
                "Job created successfully",

            job,

        });

    } catch (error) {

        console.error(
            "Create Job Error:",
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
// UPDATE JOB
// =====================================================

const updateJob = async (req, res) => {

    try {

        const {
            title,
            company,
            location,
            description,
            skills,
            requirements,
            salary,
            type,
            applyUrl,
        } = req.body;

        const job =
            await Job.findById(
                req.params.id
            );

        if (!job) {

            return res.status(404).json({

                success: false,

                message:
                    "Job not found",

            });

        }

        if (
            title !== undefined
        ) {

            job.title =
                title;

        }

        if (
            company !== undefined
        ) {

            job.company =
                company;

        }

        if (
            location !== undefined
        ) {

            job.location =
                location;

        }

        if (
            description !== undefined
        ) {

            job.description =
                description;

        }

        if (
            skills !== undefined
        ) {

            job.skills =
                Array.isArray(
                    skills
                )
                    ? skills
                    : typeof skills ===
                      "string"
                    ? skills
                        .split(",")
                        .map(
                            skill =>
                                skill.trim()
                        )
                        .filter(
                            Boolean
                        )
                    : [];

        }

        if (
            requirements !== undefined
        ) {

            job.requirements =
                requirements;

        }

        if (
            salary !== undefined
        ) {

            job.salary =
                salary;

        }

        if (
            type !== undefined
        ) {

            job.type =
                type;

        }

        if (
            applyUrl !== undefined
        ) {

            job.applyUrl =
                applyUrl;

        }

        await job.save();

        return res.status(200).json({

            success: true,

            message:
                "Job updated successfully",

            job,

        });

    } catch (error) {

        console.error(
            "Update Job Error:",
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
// DELETE JOB
// =====================================================

const deleteJob = async (req, res) => {

    try {

        const job =
            await Job.findById(
                req.params.id
            );

        if (!job) {

            return res.status(404).json({

                success: false,

                message:
                    "Job not found",

            });

        }

        await job.deleteOne();

        return res.status(200).json({

            success: true,

            message:
                "Job deleted successfully",

        });

    } catch (error) {

        console.error(
            "Delete Job Error:",
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
// GET ALL APPLICATIONS
// =====================================================

const getAllApplications = async (
    req,
    res
) => {

    try {

        const applications =
            await Application.find()
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                applications.length,

            applications,

        });

    } catch (error) {

        console.error(
            "Get All Applications Error:",
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
// UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus = async (
    req,
    res
) => {

    try {

        const {
            status,
        } = req.body;


        // =================================================
        // VALID STATUSES
        // =================================================

        const validStatuses = [

            "Applied",

            "Interview",

            "Rejected",

            "Selected",

        ];


        if (
            !validStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application status",

            });

        }


        // =================================================
        // FIND APPLICATION
        // =================================================

        const application =
            await Application.findById(
                req.params.id
            );


        if (!application) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found",

            });

        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        application.status =
            status;


        await application.save();


        return res.status(200).json({

            success: true,

            message:
                "Application status updated successfully",

            application,

        });


    } catch (error) {

        console.error(
            "Update Application Status Error:",
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
// DELETE APPLICATION
// =====================================================

const deleteApplication = async (
    req,
    res
) => {

    try {

        const application =
            await Application.findById(
                req.params.id
            );


        if (!application) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found",

            });

        }


        await application.deleteOne();


        return res.status(200).json({

            success: true,

            message:
                "Application deleted successfully",

        });


    } catch (error) {

        console.error(
            "Admin Delete Application Error:",
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

};