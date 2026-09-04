const ai = require("../config/gemini");

const Resume = require("../models/Resume");
const Job = require("../models/Job");


// =====================================================
// GEMINI MODEL
// =====================================================

const GEMINI_MODEL =
    process.env.GEMINI_MODEL ||
    "gemini-3.6-flash";


// =====================================================
// MAIN JOB MATCHING
// =====================================================

const matchResumeWithJob = async (req, res) => {

    try {

        console.log("======================================");
        console.log("JOB MATCHING STARTED");
        console.log("======================================");


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


        console.log(
            "USER ID:",
            userId
        );


        // =================================================
        // GET LATEST ANALYZED RESUME
        // =================================================

        const resume =
            await Resume.findOne({

                user:
                    userId,

                parsedData: {

                    $exists: true,

                    $ne: null

                }

            }).sort({

                createdAt:
                    -1

            });


        if (!resume) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload and analyze your resume before matching jobs."

            });

        }


        console.log(
            "RESUME ID:",
            resume._id
        );


        // =================================================
        // BUILD RESUME TEXT
        // =================================================

        const resumeText =
            buildResumeText(
                resume.parsedData
            );


        if (
            !resumeText.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Resume information could not be extracted."

            });

        }


        console.log(
            "RESUME TEXT CREATED"
        );


        // =================================================
        // GET JOBS
        // =================================================

        const jobs =
            await Job.find();


        console.log(
            "TOTAL JOBS:",
            jobs.length
        );


        if (
            !jobs ||
            jobs.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No jobs are available for matching."

            });

        }


        // =================================================
        // MATCH JOBS
        // =================================================

        const matchedJobs = [];


        for (
            const job of jobs
        ) {

            console.log(
                "======================================"
            );

            console.log(
                "MATCHING JOB:",
                job.title
            );

            console.log(
                "======================================"
            );


            let matchResult =
                null;


            // =================================================
            // TRY GEMINI WITH RETRIES
            // =================================================

            try {

                matchResult =
                    await getGeminiMatchWithRetry(

                        resumeText,

                        buildJobText(job),

                        2

                    );


            } catch (aiError) {

                console.log(
                    "Gemini matching failed."
                );

                console.log(
                    "JOB:",
                    job.title
                );

                console.log(
                    "STATUS:",
                    getErrorStatus(aiError)
                );

                console.log(
                    "MESSAGE:",
                    aiError.message
                );

            }


            // =================================================
            // FALLBACK
            // =================================================

            if (!matchResult) {

                console.log(
                    "USING FALLBACK MATCHING"
                );


                matchResult =
                    getFallbackMatch(

                        resume.parsedData,

                        job

                    );

            }


            // =================================================
            // BUILD RESPONSE
            // =================================================

            matchedJobs.push({

                jobId:
                    job._id,

                title:
                    job.title || "",

                company:
                    job.company || "",

                location:
                    job.location || "",

                description:
                    job.description || "",

                requirements:
                    job.requirements || "",

                skills:
                    Array.isArray(
                        job.skills
                    )
                        ? job.skills
                        : [],

                salary:
                    job.salary || "",

                type:
                    job.type || "",

                applyUrl:
                    job.applyUrl || "",

                matchPercentage:
                    matchResult.matchPercentage,

                reason:
                    matchResult.reason,

                matchingSkills:
                    matchResult.matchingSkills,

                missingSkills:
                    matchResult.missingSkills,

                missingKeywords:
                    matchResult.missingKeywords,

                suggestions:
                    matchResult.suggestions,

                recommendations:
                    matchResult.recommendations,

                aiGenerated:
                    matchResult.aiGenerated

            });


            // =================================================
            // DELAY BETWEEN JOBS
            // =================================================

            await sleep(
                500
            );

        }


        // =================================================
        // SORT BY SCORE
        // =================================================

        matchedJobs.sort(
            (
                a,
                b
            ) =>
                b.matchPercentage -
                a.matchPercentage
        );


        // =================================================
        // RETURN TOP 10
        // =================================================

        const bestMatches =
            matchedJobs.slice(
                0,
                10
            );


        console.log(
            "======================================"
        );

        console.log(
            "JOB MATCHING COMPLETED"
        );

        console.log(
            "MATCHES:",
            bestMatches.length
        );

        console.log(
            "======================================"
        );


        return res.status(200).json({

            success: true,

            message:
                "Jobs matched successfully.",

            totalMatches:
                matchedJobs.length,

            bestMatches

        });


    } catch (error) {

        console.error(
            "======================================"
        );

        console.error(
            "JOB MATCHING ERROR"
        );

        console.error(
            error
        );

        console.error(
            "======================================"
        );


        return res.status(500).json({

            success: false,

            message:
                "Job matching failed."

        });

    }

};


// =====================================================
// GET ERROR STATUS
// =====================================================

const getErrorStatus = (
    error
) => {

    return (

        error?.status ||

        error?.statusCode ||

        error?.code ||

        error?.response?.status ||

        null

    );

};


// =====================================================
// GEMINI MATCH WITH RETRY
// =====================================================

const getGeminiMatchWithRetry = async (

    resumeText,

    jobText,

    maxRetries = 2

) => {

    let lastError =
        null;


    for (
        let attempt = 0;

        attempt <= maxRetries;

        attempt++

    ) {

        try {

            console.log(
                `Gemini attempt ${
                    attempt + 1
                }/${maxRetries + 1}`
            );


            return await getGeminiMatch(

                resumeText,

                jobText

            );


        } catch (error) {

            lastError =
                error;


            const status =
                getErrorStatus(
                    error
                );


            console.log(
                "Gemini attempt failed:",
                status,
                error.message
            );


            // =================================================
            // RETRY TEMPORARY FAILURES ONLY
            // =================================================

            const retryable =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504 ||
                status === "429" ||
                status === "500" ||
                status === "502" ||
                status === "503" ||
                status === "504";


            if (
                !retryable ||
                attempt === maxRetries
            ) {

                throw error;

            }


            // =================================================
            // EXPONENTIAL BACKOFF
            // =================================================

            const delay =
                1000 *
                Math.pow(
                    2,
                    attempt
                );


            console.log(
                `Retrying Gemini in ${delay}ms...`
            );


            await sleep(
                delay
            );

        }

    }


    throw lastError;

};


// =====================================================
// GEMINI MATCH
// =====================================================

const getGeminiMatch = async (

    resumeText,

    jobText

) => {

    const prompt = `

You are an expert ATS resume matching system.

Compare the candidate resume with the job description.

IMPORTANT RULES:

1. Do not invent information.
2. Only use information actually present in the resume.
3. Give a realistic score from 0 to 100.
4. Identify matching skills.
5. Identify missing skills.
6. Identify missing keywords.
7. Give resume improvement suggestions.
8. Give job-specific recommendations.
9. Return only the requested JSON structure.
10. Do not return markdown.
11. Do not return code fences.
12. Keep the reason concise and specific.
13. Do not claim that the candidate has a skill unless it appears in the resume.
14. Match skills semantically where appropriate, but do not fabricate experience.

CANDIDATE RESUME
=========================

${resumeText}

=========================

JOB
=========================

${jobText}

`;


    console.log(
        "GEMINI MODEL:",
        GEMINI_MODEL
    );


    // =================================================
    // GEMINI REQUEST
    // =================================================

    const response =
        await ai.models.generateContent({

            model:
                GEMINI_MODEL,

            contents:
                prompt,

            config: {

                responseMimeType:
                    "application/json",

                responseSchema: {

                    type:
                        "object",

                    properties: {

                        matchPercentage: {

                            type:
                                "integer",

                            minimum:
                                0,

                            maximum:
                                100

                        },

                        matchingSkills: {

                            type:
                                "array",

                            items: {

                                type:
                                    "string"

                            }

                        },

                        missingSkills: {

                            type:
                                "array",

                            items: {

                                type:
                                    "string"

                            }

                        },

                        missingKeywords: {

                            type:
                                "array",

                            items: {

                                type:
                                    "string"

                            }

                        },

                        suggestions: {

                            type:
                                "array",

                            items: {

                                type:
                                    "string"

                            }

                        },

                        recommendations: {

                            type:
                                "array",

                            items: {

                                type:
                                    "string"

                            }

                        },

                        reason: {

                            type:
                                "string"

                        }

                    },

                    required: [

                        "matchPercentage",

                        "matchingSkills",

                        "missingSkills",

                        "missingKeywords",

                        "suggestions",

                        "recommendations",

                        "reason"

                    ]

                }

            }

        });


    // =================================================
    // GET RESPONSE TEXT
    // =================================================

    let result =
        response?.text || "";


    if (
        !result.trim()
    ) {

        throw new Error(
            "Gemini returned an empty response."
        );

    }


    // =================================================
    // CLEAN RESPONSE
    // =================================================

    result =
        result
            .replace(
                /```json/gi,
                ""
            )
            .replace(
                /```/g,
                ""
            )
            .trim();


    // =================================================
    // EXTRACT JSON
    // =================================================

    const firstBrace =
        result.indexOf(
            "{"
        );


    const lastBrace =
        result.lastIndexOf(
            "}"
        );


    if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
    ) {

        result =
            result.substring(
                firstBrace,
                lastBrace + 1
            );

    }


    // =================================================
    // PARSE JSON
    // =================================================

    let parsed;


    try {

        parsed =
            JSON.parse(
                result
            );


    } catch (error) {

        console.log(
            "Gemini returned invalid JSON:"
        );

        console.log(
            result
        );

        throw new Error(
            "Gemini returned invalid JSON."
        );

    }


    // =================================================
    // SCORE
    // =================================================

    let matchPercentage =
        Number(
            parsed.matchPercentage
        );


    if (
        Number.isNaN(
            matchPercentage
        )
    ) {

        matchPercentage =
            0;

    }


    matchPercentage =
        Math.max(

            0,

            Math.min(

                100,

                Math.round(
                    matchPercentage
                )

            )

        );


    // =================================================
    // RETURN NORMALIZED RESULT
    // =================================================

    return {

        matchPercentage,

        matchingSkills:
            normalizeArray(
                parsed.matchingSkills
            ),

        missingSkills:
            normalizeArray(
                parsed.missingSkills
            ),

        missingKeywords:
            normalizeArray(
                parsed.missingKeywords
            ),

        suggestions:
            normalizeArray(
                parsed.suggestions
            ),

        recommendations:
            normalizeArray(
                parsed.recommendations
            ),

        reason:
            typeof parsed.reason ===
            "string"

                ? parsed.reason.trim()

                : `Your resume has a ${matchPercentage}% match for this position.`,

        aiGenerated:
            true

    };

};


// =====================================================
// FALLBACK MATCHING
// =====================================================

const getFallbackMatch = (

    parsedData,

    job

) => {

    const resumeSkills =
        getResumeSkills(
            parsedData
        );


    const jobSkills =
        getJobSkills(
            job
        );


    const matchingSkills =
        [];


    const missingSkills =
        [];


    // =================================================
    // MATCH SKILLS
    // =================================================

    for (
        const jobSkill
        of jobSkills
    ) {

        const jobNormalized =
            normalizeSkill(
                jobSkill
            );


        if (
            !jobNormalized
        ) {

            continue;

        }


        const found =
            resumeSkills.find(

                resumeSkill => {

                    const resumeNormalized =
                        normalizeSkill(
                            resumeSkill
                        );


                    return (

                        resumeNormalized ===
                        jobNormalized

                    );

                }

            );


        if (
            found
        ) {

            if (
                !matchingSkills.includes(
                    found
                )
            ) {

                matchingSkills.push(
                    found
                );

            }

        } else {

            if (
                !missingSkills.includes(
                    jobSkill
                )
            ) {

                missingSkills.push(
                    jobSkill
                );

            }

        }

    }


    // =================================================
    // SCORE
    // =================================================

    let score =
        0;


    if (
        jobSkills.length > 0
    ) {

        score =
            Math.round(

                (
                    matchingSkills.length /
                    jobSkills.length

                ) *

                100

            );

    } else {

        score =
            calculateKeywordMatch(
                parsedData,
                job
            );

    }


    score =
        Math.max(

            0,

            Math.min(

                100,

                score

            )

        );


    // =================================================
    // REASON
    // =================================================

    let reason;


    if (
        matchingSkills.length > 0
    ) {

        reason =
            `Your resume has a ${score}% skill-based match. Matching skills include ${matchingSkills
                .slice(
                    0,
                    6
                )
                .join(
                    ", "
                )}.`;

    } else {

        reason =
            `Your resume has a ${score}% skill-based match for this position.`;

    }


    // =================================================
    // RETURN
    // =================================================

    return {

        matchPercentage:
            score,

        matchingSkills:
            matchingSkills,

        missingSkills:
            missingSkills,

        missingKeywords:
            missingSkills.slice(
                0,
                5
            ),

        suggestions:
            missingSkills.length > 0

                ? [

                    `Consider adding relevant experience with ${missingSkills
                        .slice(
                            0,
                            5
                        )
                        .join(
                            ", "
                        )} if you genuinely have it.`

                ]

                : [],

        recommendations:
            [

                "Review the job description and highlight the experience that directly matches this position."

            ],

        reason:
            reason,

        aiGenerated:
            false

    };

};


// =====================================================
// KEYWORD FALLBACK
// =====================================================

const calculateKeywordMatch = (

    parsedData,

    job

) => {

    const resumeText =
        buildResumeText(
            parsedData
        ).toLowerCase();


    const jobText =
        buildJobText(
            job
        ).toLowerCase();


    const jobWords =
        jobText
            .split(
                /\s+/
            )
            .map(

                word =>

                    word.replace(
                        /[^a-z0-9+#.]/g,
                        ""
                    )

            )
            .filter(

                word =>
                    word.length >= 3

            );


    const uniqueWords =
        [

            ...new Set(
                jobWords
            )

        ];


    if (
        uniqueWords.length === 0
    ) {

        return 0;

    }


    let matches =
        0;


    for (
        const word
        of uniqueWords
    ) {

        if (
            resumeText.includes(
                word
            )
        ) {

            matches++;

        }

    }


    return Math.round(

        (

            matches /
            uniqueWords.length

        ) *

        100

    );

};


// =====================================================
// BUILD RESUME TEXT
// =====================================================

const buildResumeText = (

    parsedData = {}

) => {

    let text = "";


    text += `

Name:
${parsedData.name || ""}

Email:
${parsedData.email || ""}

Phone:
${parsedData.phone || ""}

Skills:
`;


    if (
        Array.isArray(
            parsedData.skills
        )
    ) {

        text +=
            parsedData.skills.join(
                ", "
            );

    }


    text += `

Education:
`;


    if (
        Array.isArray(
            parsedData.education
        )
    ) {

        parsedData.education.forEach(
            education => {

                text += `

Institution:
${education?.institution || ""}

Degree:
${education?.degree || ""}

Dates:
${education?.dates || ""}

CGPA:
${education?.cgpa || ""}

`;

            }
        );

    }


    text += `

Experience:
`;


    if (
        Array.isArray(
            parsedData.experience
        )
    ) {

        parsedData.experience.forEach(
            experience => {

                text += `

Title:
${experience?.title || ""}

Organization:
${experience?.organization || ""}

Dates:
${experience?.dates || ""}

Description:
${experience?.description || ""}

`;

            }
        );

    }


    text += `

Projects:
`;


    if (
        Array.isArray(
            parsedData.projects
        )
    ) {

        parsedData.projects.forEach(
            project => {

                text += `

Project:
${project?.title || ""}

Description:
${project?.description || ""}

Technologies:
${
    Array.isArray(
        project?.technologies
    )

        ? project.technologies.join(
            ", "
        )

        : ""
}

`;

            }
        );

    }


    text += `

Certifications:
`;


    if (
        Array.isArray(
            parsedData.certifications
        )
    ) {

        text +=
            parsedData.certifications.join(
                ", "
            );

    }


    return text.trim();

};


// =====================================================
// BUILD JOB TEXT
// =====================================================

const buildJobText = (

    job = {}

) => {

    let text = `

Job Title:
${job.title || ""}

Company:
${job.company || ""}

Location:
${job.location || ""}
`;


    if (
        job.description
    ) {

        text += `

Job Description:
${job.description}
`;

    }


    const skills =
        getJobSkills(
            job
        );


    if (
        skills.length > 0
    ) {

        text += `

Required Skills:
${skills.join(
    ", "
)}
`;

    }


    if (
        job.requirements
    ) {

        text += `

Requirements:
${job.requirements}
`;

    }


    return text.trim();

};


// =====================================================
// GET RESUME SKILLS
// =====================================================

const getResumeSkills = (

    parsedData = {}

) => {

    if (
        !Array.isArray(
            parsedData.skills
        )
    ) {

        return [];

    }


    return parsedData.skills

        .map(

            skill =>
                String(
                    skill
                )

        )

        .map(

            skill =>
                skill.trim()

        )

        .filter(
            Boolean
        );

};


// =====================================================
// GET JOB SKILLS
// =====================================================

const getJobSkills = (

    job = {}

) => {

    if (
        Array.isArray(
            job.skills
        )
    ) {

        return job.skills

            .map(

                skill =>
                    String(
                        skill
                    )

            )

            .map(

                skill =>
                    skill.trim()

            )

            .filter(
                Boolean
            );

    }


    if (
        Array.isArray(
            job.requiredSkills
        )
    ) {

        return job.requiredSkills

            .map(

                skill =>
                    String(
                        skill
                    )

            )

            .map(

                skill =>
                    skill.trim()

            )

            .filter(
                Boolean
            );

    }


    if (
        typeof job.skills ===
        "string"
    ) {

        return job.skills

            .split(
                ","
            )

            .map(

                skill =>
                    skill.trim()

            )

            .filter(
                Boolean
            );

    }


    if (
        typeof job.requiredSkills ===
        "string"
    ) {

        return job.requiredSkills

            .split(
                ","
            )

            .map(

                skill =>
                    skill.trim()

            )

            .filter(
                Boolean
            );

    }


    return [];

};


// =====================================================
// NORMALIZE SKILL
// =====================================================

const normalizeSkill = (

    skill

) => {

    return String(
        skill || ""
    )

        .toLowerCase()

        .replace(
            /[^a-z0-9+#.]/g,
            ""
        );

};


// =====================================================
// NORMALIZE ARRAYS
// =====================================================

const normalizeArray = (

    value

) => {

    if (
        !Array.isArray(
            value
        )
    ) {

        return [];

    }


    return value

        .map(

            item =>
                String(
                    item
                ).trim()

        )

        .filter(
            Boolean
        );

};


// =====================================================
// SLEEP
// =====================================================

const sleep = (

    milliseconds

) => {

    return new Promise(

        resolve =>

            setTimeout(

                resolve,

                milliseconds

            )

    );

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    matchResumeWithJob

};