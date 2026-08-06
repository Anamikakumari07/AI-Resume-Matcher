const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No Resume Uploaded",

            });

        }

        // Dummy ATS Score (replace later with AI score if needed)
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

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {

    uploadResume,

};