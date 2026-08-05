const User = require("../models/User");
const Resume = require("../models/Resume");

// ==========================
// Get All Users
// ==========================
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ==========================
// Get All Resumes
// ==========================
const getAllResumes = async (req, res) => {
    try {

        const resumes = await Resume.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: resumes.length,
            resumes,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ==========================
// Delete User
// ==========================
const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }

        await Resume.deleteMany({
            user: user._id,
        });

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================
// Delete Resume
// ==========================
const deleteResume = async (req, res) => {

    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {

            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });

        }

        await resume.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ==========================
// Dashboard Statistics
// ==========================
const getAdminStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalResumes = await Resume.countDocuments();

        const resumes = await Resume.find();

        let averageATS = 0;

        if (resumes.length > 0) {

            const totalScore = resumes.reduce(
                (sum, resume) => sum + resume.atsScore,
                0
            );

            averageATS = (
                totalScore / resumes.length
            ).toFixed(2);

        }

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalResumes,
                averageATS,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    getAllUsers,
    getAllResumes,
    deleteUser,
    deleteResume,
    getAdminStats,
};