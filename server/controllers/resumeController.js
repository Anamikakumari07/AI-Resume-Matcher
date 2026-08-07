const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No Resume Uploaded",

            });

        }

        // Dummy ATS Score
        // Later you can replace this with Gemini/OpenAI generated ATS

        const atsScore = Math.floor(Math.random() * 41) + 60;

        const resume = await Resume.create({

            user: req.user.id,

            filename: req.file.originalname,

            resumeUrl: req.file.filename,

            atsScore,

        });

        res.status(201).json({

            success: true,

            message: "Resume Uploaded Successfully",

            resume,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const getMyResumes = async (req, res) => {

    try {

        const resumes = await Resume.find({

            user: req.user.id,

        }).sort({

            uploadedAt: -1,

        });

        let readinessScore = 0;

        let suggestions = [];

        if (resumes.length > 0) {

            const latestResume = resumes[0];

            readinessScore = Math.min(

                100,

                latestResume.atsScore + 10

            );

            if (latestResume.atsScore < 70) {

                suggestions.push(

                    "Improve ATS keywords."

                );

            }

            if (latestResume.atsScore < 80) {

                suggestions.push(

                    "Add more technical skills."

                );

            }

            if (latestResume.atsScore < 90) {

                suggestions.push(

                    "Add measurable achievements."

                );

            }

            if (latestResume.atsScore >= 90) {

                suggestions.push(

                    "Excellent Resume. Keep it updated."

                );

            }

        }

        res.status(200).json({

            success: true,

            resumes,

            readinessScore,

            suggestions,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const deleteResume = async (req, res) => {

    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {

            return res.status(404).json({

                success: false,

                message: "Resume Not Found",

            });

        }

        if (resume.user.toString() !== req.user.id) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized",

            });

        }

        await Resume.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Resume Deleted Successfully",

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {

    uploadResume,

    getMyResumes,

    deleteResume,

};