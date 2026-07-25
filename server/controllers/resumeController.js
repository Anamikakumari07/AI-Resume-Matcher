const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const resume = new Resume({
            user: req.user.id,
            filename: req.file.filename,
            filePath: req.file.path,
        });

        await resume.save();

        res.status(201).json({
            success: true,
            message: "Resume Uploaded Successfully",
            resume,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getMyResumes = async (req, res) => {
    try {

        const resumes = await Resume.find({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            count: resumes.length,
            resumes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    uploadResume,
    getMyResumes,
};