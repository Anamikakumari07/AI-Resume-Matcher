const Job = require("../models/Job");
const Resume = require("../models/Resume");
const ai = require("../config/gemini");

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

        console.log("Create Job Error:", error);


        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// =====================================================
// GET ALL JOBS
// =====================================================

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

        console.log("Get All Jobs Error:", error);


        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// =====================================================
// GET JOB BY ID
// =====================================================

const getJobById = async (req, res) => {

    try {

        const job = await Job.findById(
            req.params.id
        );


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

        console.log("Get Job By ID Error:", error);


        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// =====================================================
// MATCH RESUME WITH JOBS
// =====================================================

const matchJobs = async (req, res) => {

    try {

        // =================================================
        // GET LATEST RESUME
        // =================================================

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


        // =================================================
        // GET ALL JOBS
        // =================================================

        const jobs = await Job.find();


        if (jobs.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No jobs available.",
            });

        }


        // =================================================
        // PREPARE JOB DATA
        // =================================================

        const jobData = jobs.map((job, index) => {

            return {
                index: index,
                jobId: job._id.toString(),
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                skills: job.skills,
            };

        });


        // =================================================
        // GEMINI PROMPT
        // =================================================

        const prompt = `

You are an expert ATS Resume Matcher.

Analyze the candidate's resume against ALL provided jobs.

RESUME:

${JSON.stringify(resume.parsedData, null, 2)}


JOBS:

${JSON.stringify(jobData, null, 2)}


For EVERY job, calculate a realistic match percentage between 0 and 100.

Consider:

1. Technical skills
2. Required skills
3. Projects
4. Education
5. Work experience
6. Relevant technologies
7. Overall job requirements


IMPORTANT:

- Do NOT invent candidate skills.
- Do NOT assume skills that are not present.
- Give a realistic score.
- Higher score means stronger match.
- Return one result for EVERY job.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use code fences.
- Do NOT include explanations outside JSON.


Return EXACTLY this structure:

{
    "matches": [
        {
            "jobId": "job id",
            "matchPercentage": 85,
            "reason": "Short explanation of why the candidate matches this job."
        }
    ]
}

`;


        // =================================================
        // CALL GEMINI
        // =================================================

        let result;


        try {

            result = await ai.models.generateContent({

                model: "gemini-3.5-flash",

                contents: prompt,

            });


        } catch (aiError) {

            console.log(
                "Gemini Job Matching Error:",
                aiError
            );


            // ================================
            // QUOTA ERROR
            // ================================

            if (aiError.status === 429) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Gemini API quota exceeded. Please wait before trying again.",

                    errorType: "QUOTA_EXCEEDED",

                });

            }


            // ================================
            // SERVER UNAVAILABLE
            // ================================

            if (aiError.status === 503) {

                return res.status(503).json({

                    success: false,

                    message:
                        "Gemini AI is temporarily unavailable because of high demand. Please try again later.",

                    errorType: "AI_UNAVAILABLE",

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    "AI job matching failed. Please try again.",

                errorType: "AI_ERROR",

            });

        }


        // =================================================
        // GET TEXT RESPONSE
        // =================================================

        let aiResponse = result.text || "";


        console.log(
            "Gemini Job Match Response:",
            aiResponse
        );


        // =================================================
        // CLEAN RESPONSE
        // =================================================

        aiResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


        // =================================================
        // PARSE JSON
        // =================================================

        let parsedResponse;


        try {

            parsedResponse = JSON.parse(
                aiResponse
            );


        } catch (parseError) {

            console.log(
                "Job Match JSON Parse Error:",
                parseError
            );


            return res.status(500).json({

                success: false,

                message:
                    "AI returned an invalid job matching response.",

                errorType:
                    "INVALID_AI_RESPONSE",

            });

        }


        // =================================================
        // CREATE MATCHED JOB LIST
        // =================================================

        const matches = parsedResponse.matches || [];


        const matchedJobs = jobs.map((job) => {

            const match = matches.find(
                (item) =>
                    item.jobId === job._id.toString()
            );


            return {

                jobId: job._id,

                title: job.title,

                company: job.company,

                location: job.location,

                matchPercentage:
                    match?.matchPercentage || 0,

                reason:
                    match?.reason ||
                    "No matching analysis available.",

            };

        });


        // =================================================
        // SORT BY MATCH %
        // =================================================

        matchedJobs.sort((a, b) => {

            return (
                b.matchPercentage -
                a.matchPercentage
            );

        });


        // =================================================
        // RETURN BEST MATCHES
        // =================================================

        res.status(200).json({

            success: true,

            totalMatches:
                matchedJobs.length,

            bestMatches:
                matchedJobs.slice(0, 5),

        });


    } catch (error) {

        console.log(
            "Job Matching Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createJob,

    getAllJobs,

    getJobById,

    matchJobs,

};