const Job = require("../models/Job");
const Resume = require("../models/Resume");
const ai = require("../config/gemini");

// Create Job
const createJob = async (req, res) => {
    try {

        const {
            title,
            company,
            location,
            description,
            skills,
        } = req.body;

        const job = new Job({
            title,
            company,
            location,
            description,
            skills,
        });

        await job.save();

        res.status(201).json({
            success: true,
            message: "Job Created Successfully",
            job,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get All Jobs
const getAllJobs = async (req, res) => {

    try {

        const jobs = await Job.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Get Job By ID
const getJobById = async (req, res) => {

    try {

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            job,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Match Resume with Jobs
const matchJobs = async (req, res) => {

    try {

        const resume = await Resume.findOne({
            user: req.user.id,
        }).sort({
            uploadedAt: -1,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Please upload a resume first.",
            });
        }

        const jobs = await Job.find();

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No jobs available.",
            });
        }

        let matchedJobs = [];

        for (const job of jobs) {

            const prompt = `
You are an ATS Resume Matcher.

Resume Analysis:
${resume.analysis}

Job Title:
${job.title}

Company:
${job.company}

Location:
${job.location}

Job Description:
${job.description}

Required Skills:
${job.skills.join(", ")}

Compare the resume with the job.

Return ONLY valid JSON.

{
  "matchPercentage": 90,
  "reason": "Candidate has strong MERN Stack skills and meets most requirements."
}
`;

            const result = await ai.models.generateContent({
                model: "gemini-flash-latest",
                contents: prompt,
            });

            const aiResponse =
                result.text ||
                result.response?.text() ||
                "";

            let parsedResponse;

            try {

                parsedResponse = JSON.parse(aiResponse);

            } catch {

                parsedResponse = {
                    matchPercentage: 0,
                    reason: "Unable to parse AI response."
                };

            }

            matchedJobs.push({

                jobId: job._id,

                title: job.title,

                company: job.company,

                location: job.location,

                matchPercentage: parsedResponse.matchPercentage,

                reason: parsedResponse.reason,

            });

        }

        matchedJobs.sort((a, b) => {

            return b.matchPercentage - a.matchPercentage;

        });

        res.status(200).json({

            success: true,

            totalMatches: matchedJobs.length,

            bestMatches: matchedJobs.slice(0, 5),

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
    createJob,
    getAllJobs,
    getJobById,
    matchJobs,
};