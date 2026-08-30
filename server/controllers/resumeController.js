const Resume = require("../models/Resume");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const ai = require("../config/gemini");


// =====================================================
// CALCULATE ATS SCORE
// =====================================================

const calculateATSScore = (parsedResume) => {

    let score = 0;


    // =================================================
    // CONTACT INFORMATION
    // =================================================

    if (
        parsedResume.name &&
        String(parsedResume.name).trim()
    ) {

        score += 10;

    }


    if (
        parsedResume.email &&
        String(parsedResume.email).trim()
    ) {

        score += 10;

    }


    if (
        parsedResume.phone &&
        String(parsedResume.phone).trim()
    ) {

        score += 5;

    }


    // =================================================
    // SKILLS
    // =================================================

    if (
        Array.isArray(
            parsedResume.skills
        )
    ) {

        const skillCount =
            parsedResume.skills.length;


        if (
            skillCount >= 10
        ) {

            score += 25;

        } else if (
            skillCount >= 5
        ) {

            score += 20;

        } else if (
            skillCount >= 3
        ) {

            score += 15;

        } else if (
            skillCount > 0
        ) {

            score += 10;

        }

    }


    // =================================================
    // EDUCATION
    // =================================================

    if (
        Array.isArray(
            parsedResume.education
        ) &&
        parsedResume.education.length > 0
    ) {

        score += 15;

    }


    // =================================================
    // EXPERIENCE
    // =================================================

    if (
        Array.isArray(
            parsedResume.experience
        )
    ) {

        const experienceCount =
            parsedResume.experience.length;


        if (
            experienceCount >= 2
        ) {

            score += 15;

        } else if (
            experienceCount === 1
        ) {

            score += 10;

        }

    }


    // =================================================
    // PROJECTS
    // =================================================

    if (
        Array.isArray(
            parsedResume.projects
        )
    ) {

        const projectCount =
            parsedResume.projects.length;


        if (
            projectCount >= 2
        ) {

            score += 10;

        } else if (
            projectCount === 1
        ) {

            score += 5;

        }

    }


    // =================================================
    // CERTIFICATIONS
    // =================================================

    if (
        Array.isArray(
            parsedResume.certifications
        ) &&
        parsedResume.certifications.length > 0
    ) {

        score += 5;

    }


    // =================================================
    // FINAL SCORE
    // =================================================

    return Math.min(
        100,
        Math.max(
            0,
            score
        )
    );

};


// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (req, res) => {

    try {

        console.log("=================================");
        console.log("RESUME UPLOAD");
        console.log("USER:", req.user?.id);
        console.log(
            "FILE:",
            req.file?.originalname
        );
        console.log("=================================");


        // =================================================
        // AUTH CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required.",

            });

        }


        // =================================================
        // FILE CHECK
        // =================================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "No Resume Uploaded.",

            });

        }


        // =================================================
        // CREATE RESUME
        // =================================================

        const resume =
            await Resume.create({

                user:
                    req.user.id,

                filename:
                    req.file.originalname,

                resumeUrl:
                    req.file.filename,

                atsScore:
                    0,

                parsedData:
                    null,

            });


        console.log("=================================");
        console.log("RESUME CREATED");
        console.log("ID:", resume._id);
        console.log(
            "USER:",
            resume.user
        );
        console.log(
            "FILENAME:",
            resume.filename
        );
        console.log("=================================");


        return res.status(201).json({

            success: true,

            message:
                "Resume Uploaded Successfully",

            resume,

        });


    } catch (error) {

        console.error(
            "Upload Resume Error:",
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
// PARSE RESUME WITH GEMINI
// =====================================================

const parseResumeWithAI = async (
    req,
    res
) => {

    try {

        console.log("=================================");
        console.log("RESUME PARSE STARTED");
        console.log("USER:", req.user?.id);
        console.log(
            "FILE:",
            req.file?.originalname
        );
        console.log("=================================");


        // =================================================
        // AUTH CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required.",

            });

        }


        // =================================================
        // FILE CHECK
        // =================================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "No Resume Uploaded.",

            });

        }


        // =================================================
        // FIND USER'S LATEST RESUME RECORD
        // =================================================

        let resumeRecord =
            await Resume.findOne({

                user:
                    req.user.id,

            }).sort({

                createdAt:
                    -1,

            });


        // =================================================
        // FALLBACK USING ORIGINAL FILE NAME
        // =================================================

        if (!resumeRecord) {

            resumeRecord =
                await Resume.findOne({

                    user:
                        req.user.id,

                    filename:
                        req.file.originalname,

                }).sort({

                    createdAt:
                        -1,

                });

        }


        // =================================================
        // RESUME RECORD CHECK
        // =================================================

        if (!resumeRecord) {

            console.log(
                "RESUME RECORD NOT FOUND"
            );


            return res.status(404).json({

                success: false,

                message:
                    "Resume record not found. Please upload the resume first.",

            });

        }


        console.log("=================================");
        console.log(
            "RESUME RECORD FOUND"
        );
        console.log(
            "RESUME ID:",
            resumeRecord._id
        );
        console.log(
            "DB USER:",
            resumeRecord.user
        );
        console.log(
            "DB FILE:",
            resumeRecord.filename
        );
        console.log("=================================");


        // =================================================
        // READ FILE
        // =================================================

        const filePath =
            req.file.path;


        if (
            !fs.existsSync(
                filePath
            )
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Uploaded resume file not found.",

            });

        }


        const dataBuffer =
            fs.readFileSync(
                filePath
            );


        // =================================================
        // EXTRACT PDF TEXT
        // =================================================

        const pdfData =
            await pdfParse(
                dataBuffer
            );


        const resumeText =
            pdfData.text ||
            "";


        console.log("=================================");
        console.log(
            "EXTRACTED RESUME TEXT"
        );
        console.log("=================================");
        console.log(
            resumeText
        );
        console.log("=================================");


        // =================================================
        // TEXT CHECK
        // =================================================

        if (
            !resumeText.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Could not extract text from resume.",

            });

        }


        // =================================================
        // GEMINI PROMPT
        // =================================================

        const prompt = `

You are an expert professional resume parser.

Analyze the COMPLETE resume text below.

Extract only information that is actually present.

IMPORTANT RULES:

1. Do not invent information.
2. Do not guess information.
3. Search the entire resume.
4. Extract full name.
5. Extract email.
6. Extract phone.
7. Extract all technical skills.
8. Extract all non-technical skills.
9. Extract all education.
10. Extract institution.
11. Extract degree.
12. Extract dates.
13. Extract CGPA or percentage.
14. Extract all work experience.
15. Extract internships.
16. Extract leadership positions.
17. Extract club positions.
18. Extract volunteer experience.
19. Extract organization names.
20. Extract experience dates.
21. Extract all projects.
22. Extract project descriptions.
23. Extract project technologies.
24. Extract all certifications.
25. If information is not present, return an empty string or empty array.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return code fences.

Use EXACTLY this structure:

{
    "name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "education": [
        {
            "institution": "",
            "degree": "",
            "dates": "",
            "cgpa": ""
        }
    ],
    "experience": [
        {
            "title": "",
            "organization": "",
            "dates": "",
            "description": ""
        }
    ],
    "projects": [
        {
            "title": "",
            "description": "",
            "technologies": []
        }
    ],
    "certifications": []
}

COMPLETE RESUME TEXT:

${resumeText}

`;


        // =================================================
        // GEMINI MODEL
        // =================================================

        const model =
            process.env.GEMINI_MODEL ||
            "gemini-3.6-flash";


        console.log(
            "GEMINI MODEL:",
            model
        );


        // =================================================
        // GEMINI REQUEST
        // =================================================

        let response;


        try {

            response =
                await ai.models.generateContent({

                    model:
                        model,

                    contents:
                        prompt,

                });


        } catch (aiError) {

            console.error(
                "================================="
            );

            console.error(
                "GEMINI ERROR"
            );

            console.error(
                "STATUS:",
                aiError.status
            );

            console.error(
                "MESSAGE:",
                aiError.message
            );

            console.error(
                aiError
            );

            console.error(
                "================================="
            );


            // =================================================
            // QUOTA
            // =================================================

            if (
                aiError.status === 429
            ) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Gemini API quota exceeded. Please try again later.",

                    errorType:
                        "QUOTA_EXCEEDED",

                });

            }


            // =================================================
            // TEMPORARY UNAVAILABLE
            // =================================================

            if (
                aiError.status === 503
            ) {

                return res.status(503).json({

                    success: false,

                    message:
                        "Gemini AI is temporarily unavailable. Please try again later.",

                    errorType:
                        "AI_UNAVAILABLE",

                });

            }


            // =================================================
            // MODEL NOT FOUND
            // =================================================

            if (
                aiError.status === 404
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Gemini model is unavailable. Please check the configured Gemini model.",

                    errorType:
                        "MODEL_NOT_FOUND",

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    aiError.message ||
                    "AI resume analysis failed.",

                errorType:
                    "AI_ERROR",

            });

        }


        // =================================================
        // GEMINI RESPONSE
        // =================================================

        let result =
            response.text ||
            "";


        console.log("=================================");
        console.log(
            "GEMINI RAW RESPONSE"
        );
        console.log("=================================");
        console.log(
            result
        );
        console.log("=================================");


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
        // JSON EXTRACTION
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
            lastBrace !== -1
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

        let parsedResume;


        try {

            parsedResume =
                JSON.parse(
                    result
                );


        } catch (parseError) {

            console.error(
                "Gemini JSON Parse Error:",
                parseError
            );


            console.error(
                "Gemini Result:",
                result
            );


            return res.status(500).json({

                success: false,

                message:
                    "AI returned an invalid resume analysis.",

                errorType:
                    "INVALID_AI_RESPONSE",

            });

        }


        // =================================================
        // CALCULATE ATS SCORE
        // =================================================

        const atsScore =
            calculateATSScore(
                parsedResume
            );


        console.log(
            "================================="
        );

        console.log(
            "CALCULATED ATS SCORE:",
            atsScore
        );

        console.log(
            "================================="
        );


        // =================================================
        // SAVE DATA
        // =================================================

        resumeRecord.parsedData =
            parsedResume;


        resumeRecord.atsScore =
            atsScore;


        await resumeRecord.save();


        // =================================================
        // DATABASE VERIFICATION
        // =================================================

        const savedResume =
            await Resume.findById(
                resumeRecord._id
            );


        console.log("=================================");
        console.log(
            "DATABASE VERIFICATION"
        );
        console.log(
            "RESUME ID:",
            savedResume?._id
        );
        console.log(
            "ATS SCORE:",
            savedResume?.atsScore
        );
        console.log(
            "HAS PARSED DATA:",
            !!savedResume?.parsedData
        );
        console.log(
            "PARSED DATA:",
            savedResume?.parsedData
        );
        console.log("=================================");


        if (
            !savedResume ||
            !savedResume.parsedData
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Resume was analyzed but parsed data could not be saved.",

                errorType:
                    "PARSED_DATA_NOT_SAVED",

            });

        }


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Resume Parsed Successfully",

            atsScore:
                savedResume.atsScore,

            data:
                savedResume.parsedData,

        });


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "RESUME PARSING ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Something went wrong while processing the resume.",

        });

    }

};


// =====================================================
// GET MY RESUMES
// =====================================================

const getMyResumes = async (
    req,
    res
) => {

    try {

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required.",

            });

        }


        const resumes =
            await Resume.find({

                user:
                    req.user.id,

            }).sort({

                createdAt:
                    -1,

            });


        let readinessScore = 0;

        let suggestions = [];


        // =================================================
        // LATEST RESUME
        // =================================================

        if (
            resumes.length > 0
        ) {

            const latestResume =
                resumes[0];


            // Use ATS score directly.

            const atsScore =
                Number(
                    latestResume.atsScore
                ) || 0;


            readinessScore =
                atsScore;


            // =================================================
            // SUGGESTIONS
            // =================================================

            if (
                atsScore < 70
            ) {

                suggestions.push(
                    "Improve ATS keywords."
                );

            }


            if (
                atsScore < 80
            ) {

                suggestions.push(
                    "Add more relevant technical skills."
                );

            }


            if (
                atsScore < 90
            ) {

                suggestions.push(
                    "Add measurable achievements and strong action verbs."
                );

            }


            if (
                atsScore >= 90
            ) {

                suggestions.push(
                    "Excellent resume. Keep it updated."
                );

            }


            // =================================================
            // MISSING RESUME INFORMATION
            // =================================================

            const parsed =
                latestResume.parsedData;


            if (
                parsed
            ) {

                if (
                    !parsed.phone
                ) {

                    suggestions.push(
                        "Consider adding a professional phone number."
                    );

                }


                if (
                    !Array.isArray(
                        parsed.projects
                    ) ||
                    parsed.projects.length === 0
                ) {

                    suggestions.push(
                        "Add relevant projects to demonstrate your practical skills."
                    );

                }


                if (
                    !Array.isArray(
                        parsed.certifications
                    ) ||
                    parsed.certifications.length === 0
                ) {

                    suggestions.push(
                        "Add relevant certifications if you have them."
                    );

                }

            }

        }


        // =================================================
        // LIMIT SUGGESTIONS
        // =================================================

        suggestions =
            suggestions.slice(
                0,
                6
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            resumes,

            readinessScore,

            suggestions,

        });


    } catch (error) {

        console.error(
            "Get Resumes Error:",
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

const deleteResume = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTH CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required.",

            });

        }


        // =================================================
        // FIND RESUME
        // =================================================

        const resume =
            await Resume.findById(
                req.params.id
            );


        if (!resume) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume Not Found",

            });

        }


        // =================================================
        // OWNERSHIP CHECK
        // =================================================

        if (
            resume.user.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Unauthorized",

            });

        }


        // =================================================
        // DELETE DATABASE RECORD
        // =================================================

        await Resume.findByIdAndDelete(
            req.params.id
        );


        // =================================================
        // DELETE FILE
        // =================================================

        const filePath =
            `uploads/${resume.resumeUrl}`;


        if (
            fs.existsSync(
                filePath
            )
        ) {

            fs.unlinkSync(
                filePath
            );

        }


        return res.status(200).json({

            success: true,

            message:
                "Resume Deleted Successfully",

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
// EXPORT
// =====================================================

module.exports = {

    uploadResume,

    parseResumeWithAI,

    getMyResumes,

    deleteResume,

};