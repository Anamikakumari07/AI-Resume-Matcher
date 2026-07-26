const Resume = require("../models/Resume");
const extractTextFromPDF = require("../utils/extractText");
const ai = require("../config/gemini");

// Upload Resume
const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume",
            });
        }

        // Extract text from PDF
        const extractedText = await extractTextFromPDF(req.file.path);

        // Gemini Prompt
        const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume and provide:

1. ATS Score (out of 100)
2. Technical Skills
3. Strengths
4. Weaknesses
5. Suggestions for Improvement

Resume:

${extractedText}
`;

        // Gemini AI Response
        const result = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        // Get response text
        const aiResponse =
            result.text ||
            result.response?.text() ||
            "";

        // Extract ATS Score
        let atsScore = 0;

        const match = aiResponse.match(/\d+/);

        if (match) {
            atsScore = Number(match[0]);
        }

        // Save Resume
        const resume = new Resume({
            user: req.user.id,
            filename: req.file.filename,
            filePath: req.file.path,
            analysis: aiResponse,
            atsScore: atsScore,
        });

        await resume.save();

        res.status(201).json({
            success: true,
            message: "Resume Uploaded Successfully",
            atsScore,
            analysis: aiResponse,
            resume,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get All Resumes
const getMyResumes = async (req, res) => {
    try {

        const resumes = await Resume.find({
            user: req.user.id,
        }).sort({
            uploadedAt: -1,
        });

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

// Get Resume By ID
const getResumeById = async (req, res) => {
    try {

        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        res.status(200).json({
            success: true,
            resume,
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
    uploadResume,
    getMyResumes,
    getResumeById,
};