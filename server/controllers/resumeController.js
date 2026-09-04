const mongoose = require("mongoose");

const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const ai = require("../config/gemini");
const cloudinary = require("../config/cloudinary");


// =====================================================
// GEMINI MODEL
// =====================================================

const GEMINI_MODEL =
    process.env.GEMINI_MODEL ||
    "gemini-3.5-flash";


// =====================================================
// ATS SCORE
// =====================================================
//
// This score measures resume completeness and quality.
// It is NOT a job-specific keyword match.
//
// Maximum = 100
//
// Contact       = 15
// Skills        = 20
// Education     = 15
// Experience    = 20
// Projects      = 20
// Certifications= 10
// =====================================================

const calculateATSScore = (
    parsedResume = {}
) => {

    let score = 0;


    // =================================================
    // CONTACT INFORMATION - 15
    // =================================================

    if (
        hasText(parsedResume.name)
    ) {

        score += 5;

    }


    if (
        hasValidEmail(parsedResume.email)
    ) {

        score += 5;

    }


    if (
        hasText(parsedResume.phone)
    ) {

        score += 5;

    }


    // =================================================
    // SKILLS - 20
    // =================================================

    const skills =
        Array.isArray(parsedResume.skills)
            ? parsedResume.skills.filter(
                skill => hasText(skill)
            )
            : [];


    const skillCount =
        new Set(
            skills.map(
                skill =>
                    String(skill)
                        .trim()
                        .toLowerCase()
            )
        ).size;


    if (
        skillCount >= 10
    ) {

        score += 20;

    } else if (
        skillCount >= 7
    ) {

        score += 17;

    } else if (
        skillCount >= 5
    ) {

        score += 14;

    } else if (
        skillCount >= 3
    ) {

        score += 10;

    } else if (
        skillCount >= 1
    ) {

        score += 5;

    }


    // =================================================
    // EDUCATION - 15
    // =================================================

    const education =
        Array.isArray(parsedResume.education)
            ? parsedResume.education
            : [];


    if (
        education.length > 0
    ) {

        score += 7;

        const completeEducation =
            education.filter(

                item =>

                    hasText(
                        item?.institution
                    ) &&

                    hasText(
                        item?.degree
                    )

            );


        if (
            completeEducation.length > 0
        ) {

            score += 4;

        }


        const educationWithDates =
            education.filter(

                item =>
                    hasText(
                        item?.dates
                    )

            );


        if (
            educationWithDates.length > 0
        ) {

            score += 2;

        }


        const educationWithGrade =
            education.filter(

                item =>
                    hasText(
                        item?.cgpa
                    )

            );


        if (
            educationWithGrade.length > 0
        ) {

            score += 2;

        }

    }


    // =================================================
    // EXPERIENCE - 20
    // =================================================

    const experience =
        Array.isArray(parsedResume.experience)
            ? parsedResume.experience
            : [];


    if (
        experience.length > 0
    ) {

        score += 6;

    }


    const completeExperience =
        experience.filter(

            item =>

                hasText(
                    item?.title
                ) &&

                hasText(
                    item?.organization
                )

        );


    if (
        completeExperience.length > 0
    ) {

        score += 4;

    }


    const experienceWithDates =
        experience.filter(

            item =>
                hasText(
                    item?.dates
                )

        );


    if (
        experienceWithDates.length > 0
    ) {

        score += 3;

    }


    const experienceWithDescription =
        experience.filter(

            item =>

                hasText(
                    item?.description
                )

        );


    if (
        experienceWithDescription.length > 0
    ) {

        score += 4;

    }


    const strongExperienceDescriptions =
        experience.filter(

            item => {

                const description =
                    String(
                        item?.description || ""
                    ).trim();

                return (
                    description.length >= 80
                );

            }

        );


    if (
        strongExperienceDescriptions.length > 0
    ) {

        score += 3;

    }


    // =================================================
    // PROJECTS - 20
    // =================================================

    const projects =
        Array.isArray(parsedResume.projects)
            ? parsedResume.projects
            : [];


    if (
        projects.length > 0
    ) {

        score += 5;

    }


    if (
        projects.length >= 2
    ) {

        score += 3;

    }


    const completeProjects =
        projects.filter(

            item =>

                hasText(
                    item?.title
                ) &&

                hasText(
                    item?.description
                )

        );


    if (
        completeProjects.length > 0
    ) {

        score += 5;

    }


    const projectsWithTechnologies =
        projects.filter(

            item =>

                Array.isArray(
                    item?.technologies
                ) &&

                item.technologies.length > 0

        );


    if (
        projectsWithTechnologies.length > 0
    ) {

        score += 4;

    }


    const strongProjects =
        projects.filter(

            item => {

                const description =
                    String(
                        item?.description || ""
                    ).trim();


                const technologies =
                    Array.isArray(
                        item?.technologies
                    )
                        ? item.technologies
                        : [];


                return (

                    description.length >= 80 &&
                    technologies.length >= 2

                );

            }

        );


    if (
        strongProjects.length > 0
    ) {

        score += 3;

    }


    // =================================================
    // CERTIFICATIONS - 10
    // =================================================

    const certifications =
        Array.isArray(
            parsedResume.certifications
        )

            ? parsedResume.certifications.filter(
                certificate =>
                    hasText(certificate)
            )

            : [];


    if (
        certifications.length > 0
    ) {

        score += 5;

    }


    if (
        certifications.length >= 2
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
            Math.round(score)
        )

    );

};


// =====================================================
// UPLOAD BUFFER TO CLOUDINARY
// =====================================================

const uploadToCloudinary = (
    buffer,
    originalName
) => {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const safeName =
                String(
                    originalName ||
                    "resume"
                )
                    .replace(
                        /\.pdf$/i,
                        ""
                    )
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        "-"
                    )
                    .slice(
                        0,
                        80
                    );


            const publicId =
                `${Date.now()}-${safeName || "resume"}`;


            const uploadStream =
                cloudinary.uploader.upload_stream(

                    {
                        resource_type:
                            "raw",

                        folder:
                            "ai-resume-matcher/resumes",

                        public_id:
                            publicId

                    },

                    (
                        error,
                        result
                    ) => {

                        if (error) {

                            reject(
                                error
                            );

                            return;

                        }


                        resolve(
                            result
                        );

                    }

                );


            uploadStream.end(
                buffer
            );

        }
    );

};


// =====================================================
// DELETE CLOUDINARY FILE
// =====================================================

const deleteFromCloudinary = async (
    publicId
) => {

    if (
        !publicId
    ) {

        return;

    }


    try {

        await cloudinary.uploader.destroy(

            publicId,

            {
                resource_type:
                    "raw",

                invalidate:
                    true

            }

        );

    } catch (error) {

        console.error(
            "Cloudinary delete failed."
        );

    }

};


// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (
    req,
    res
) => {

    let cloudinaryPublicId =
        null;


    try {

        // =================================================
        // AUTH CHECK
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success:
                    false,

                message:
                    "User authentication required."

            });

        }


        // =================================================
        // FILE CHECK
        // =================================================

        if (
            !req.file
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "No resume uploaded."

            });

        }


        // =================================================
        // MIME TYPE
        // =================================================

        if (
            req.file.mimetype !==
            "application/pdf"
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Only PDF files are allowed."

            });

        }


        // =================================================
        // BUFFER
        // =================================================

        if (
            !req.file.buffer ||
            !Buffer.isBuffer(
                req.file.buffer
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Uploaded file data is unavailable."

            });

        }


        // =================================================
        // SIZE
        // =================================================

        if (
            req.file.size >
            5 * 1024 * 1024
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Resume file must be 5 MB or smaller."

            });

        }


        // =================================================
        // CLOUDINARY UPLOAD
        // =================================================

        const cloudinaryResult =
            await uploadToCloudinary(

                req.file.buffer,

                req.file.originalname

            );


        if (
            !cloudinaryResult ||
            !cloudinaryResult.secure_url ||
            !cloudinaryResult.public_id
        ) {

            return res.status(500).json({

                success:
                    false,

                message:
                    "Resume could not be uploaded to cloud storage."

            });

        }


        cloudinaryPublicId =
            cloudinaryResult.public_id;


        // =================================================
        // DATABASE
        // =================================================

        const resume =
            await Resume.create({

                user:
                    req.user.id,

                filename:
                    String(
                        req.file.originalname ||
                        "resume.pdf"
                    ).slice(
                        0,
                        255
                    ),

                resumeUrl:
                    cloudinaryResult.secure_url,

                cloudinaryPublicId:
                    cloudinaryResult.public_id,

                atsScore:
                    0,

                parsedData:
                    null

            });


        return res.status(201).json({

            success:
                true,

            message:
                "Resume uploaded successfully.",

            resume

        });


    } catch (error) {

        console.error(
            "Upload Resume Error:",
            error.message
        );


        // =================================================
        // CLEANUP CLOUDINARY
        // =================================================

        if (
            cloudinaryPublicId
        ) {

            await deleteFromCloudinary(
                cloudinaryPublicId
            );

        }


        if (
            error instanceof
            mongoose.Error.ValidationError
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Invalid resume data."

            });

        }


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to upload resume."

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

        // =================================================
        // AUTH
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success:
                    false,

                message:
                    "User authentication required."

            });

        }


        // =================================================
        // FILE
        // =================================================

        if (
            !req.file
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "No resume uploaded."

            });

        }


        if (
            req.file.mimetype !==
            "application/pdf"
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Only PDF files are allowed."

            });

        }


        if (
            !req.file.buffer ||
            !Buffer.isBuffer(
                req.file.buffer
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Uploaded resume data is unavailable."

            });

        }


        // =================================================
        // SIZE
        // =================================================

        if (
            req.file.size >
            5 * 1024 * 1024
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Resume file must be 5 MB or smaller."

            });

        }


        // =================================================
        // RESUME ID
        // =================================================

        const resumeId =
            req.params.resumeId ||
            req.body.resumeId;


        if (
            !resumeId
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Resume ID is required."

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                resumeId
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Invalid resume ID."

            });

        }


        // =================================================
        // FIND USER'S RESUME
        // =================================================

        const resumeRecord =
            await Resume.findOne({

                _id:
                    resumeId,

                user:
                    req.user.id

            });


        if (
            !resumeRecord
        ) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Resume record not found."

            });

        }


        // =================================================
        // PARSE PDF
        // =================================================

        const pdfData =
            await pdfParse(
                req.file.buffer
            );


        const resumeText =
            String(
                pdfData?.text ||
                ""
            ).trim();


        if (
            !resumeText
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Could not extract text from resume."

            });

        }


        // =================================================
        // GEMINI PROMPT
        // =================================================

        const prompt = `

You are an expert professional resume parser.

Analyze the complete resume text below.

Extract ONLY information actually present.

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
25. If information is missing, return an empty string or empty array.
26. Return only JSON.
27. Do not return markdown.
28. Do not return code fences.
29. Preserve the meaning of the original resume.
30. Do not create skills, jobs, projects or certifications that do not appear in the resume.

Return exactly the requested JSON structure.

COMPLETE RESUME TEXT:

${resumeText}

`;


        // =================================================
        // GEMINI REQUEST
        // =================================================

        let response;


        try {

            response =
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

                                name: {

                                    type:
                                        "string"

                                },

                                email: {

                                    type:
                                        "string"

                                },

                                phone: {

                                    type:
                                        "string"

                                },

                                skills: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "string"

                                    }

                                },

                                education: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "object",

                                        properties: {

                                            institution: {

                                                type:
                                                    "string"

                                            },

                                            degree: {

                                                type:
                                                    "string"

                                            },

                                            dates: {

                                                type:
                                                    "string"

                                            },

                                            cgpa: {

                                                type:
                                                    "string"

                                            }

                                        },

                                        required: [

                                            "institution",

                                            "degree",

                                            "dates",

                                            "cgpa"

                                        ]

                                    }

                                },

                                experience: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "object",

                                        properties: {

                                            title: {

                                                type:
                                                    "string"

                                            },

                                            organization: {

                                                type:
                                                    "string"

                                            },

                                            dates: {

                                                type:
                                                    "string"

                                            },

                                            description: {

                                                type:
                                                    "string"

                                            }

                                        },

                                        required: [

                                            "title",

                                            "organization",

                                            "dates",

                                            "description"

                                        ]

                                    }

                                },

                                projects: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "object",

                                        properties: {

                                            title: {

                                                type:
                                                    "string"

                                            },

                                            description: {

                                                type:
                                                    "string"

                                            },

                                            technologies: {

                                                type:
                                                    "array",

                                                items: {

                                                    type:
                                                        "string"

                                                }

                                            }

                                        },

                                        required: [

                                            "title",

                                            "description",

                                            "technologies"

                                        ]

                                    }

                                },

                                certifications: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "string"

                                    }

                                }

                            },

                            required: [

                                "name",

                                "email",

                                "phone",

                                "skills",

                                "education",

                                "experience",

                                "projects",

                                "certifications"

                            ]

                        }

                    }

                });


        } catch (aiError) {

            const status =
                aiError?.status ||
                aiError?.statusCode ||
                aiError?.code ||
                aiError?.response?.status ||
                null;


            console.error(

                "Gemini Resume Parse Error:",

                status,

                aiError.message

            );


            if (
                status === 429 ||
                status === "429"
            ) {

                return res.status(429).json({

                    success:
                        false,

                    message:
                        "Gemini API quota exceeded. Please try again later.",

                    errorType:
                        "QUOTA_EXCEEDED"

                });

            }


            if (
                status === 503 ||
                status === "503"
            ) {

                return res.status(503).json({

                    success:
                        false,

                    message:
                        "Gemini AI is temporarily unavailable. Please try again later.",

                    errorType:
                        "AI_UNAVAILABLE"

                });

            }


            if (
                status === 404 ||
                status === "404"
            ) {

                return res.status(503).json({

                    success:
                        false,

                    message:
                        "Gemini AI model is currently unavailable.",

                    errorType:
                        "MODEL_UNAVAILABLE"

                });

            }


            return res.status(502).json({

                success:
                    false,

                message:
                    "AI resume analysis failed. Please try again.",

                errorType:
                    "AI_ERROR"

            });

        }


        // =================================================
        // GEMINI RESPONSE
        // =================================================

        let result =
            response?.text ||
            "";


        if (
            typeof result !== "string" ||
            !result.trim()
        ) {

            return res.status(502).json({

                success:
                    false,

                message:
                    "Gemini returned an empty response.",

                errorType:
                    "EMPTY_AI_RESPONSE"

            });

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

        let parsedResume;


        try {

            parsedResume =
                JSON.parse(
                    result
                );


        } catch (parseError) {

            console.error(
                "Gemini returned invalid JSON."
            );


            return res.status(502).json({

                success:
                    false,

                message:
                    "AI returned an invalid resume analysis.",

                errorType:
                    "INVALID_AI_RESPONSE"

            });

        }


        // =================================================
        // NORMALIZE
        // =================================================

        parsedResume =
            normalizeParsedResume(
                parsedResume
            );


        // =================================================
        // ATS SCORE
        // =================================================

        const atsScore =
            calculateATSScore(
                parsedResume
            );


        // =================================================
        // SAVE
        // =================================================

        resumeRecord.parsedData =
            parsedResume;


        resumeRecord.atsScore =
            atsScore;


        await resumeRecord.save();


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

            success:
                true,

            message:
                "Resume parsed successfully.",

            resumeId:
                resumeRecord._id,

            atsScore:
                resumeRecord.atsScore,

            data:
                resumeRecord.parsedData

        });


    } catch (error) {

        console.error(
            "Resume Parsing Error:",
            error.message
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Something went wrong while processing the resume.",

            errorType:
                "RESUME_PARSE_ERROR"

        });

    }

};


// =====================================================
// NORMALIZE PARSED RESUME
// =====================================================

const normalizeParsedResume = (
    data = {}
) => {

    const education =
        Array.isArray(
            data.education
        )

            ? data.education

                .map(

                    item => ({

                        institution:
                            safeString(
                                item?.institution
                            ),

                        degree:
                            safeString(
                                item?.degree
                            ),

                        dates:
                            safeString(
                                item?.dates
                            ),

                        cgpa:
                            safeString(
                                item?.cgpa
                            )

                    })

                )

                .filter(

                    item =>

                        item.institution ||
                        item.degree ||
                        item.dates ||
                        item.cgpa

                )

            : [];


    const experience =
        Array.isArray(
            data.experience
        )

            ? data.experience

                .map(

                    item => ({

                        title:
                            safeString(
                                item?.title
                            ),

                        organization:
                            safeString(
                                item?.organization
                            ),

                        dates:
                            safeString(
                                item?.dates
                            ),

                        description:
                            safeString(
                                item?.description
                            )

                    })

                )

                .filter(

                    item =>

                        item.title ||
                        item.organization ||
                        item.dates ||
                        item.description

                )

            : [];


    const projects =
        Array.isArray(
            data.projects
        )

            ? data.projects

                .map(

                    item => ({

                        title:
                            safeString(
                                item?.title
                            ),

                        description:
                            safeString(
                                item?.description
                            ),

                        technologies:
                            normalizeArray(
                                item?.technologies
                            )

                    })

                )

                .filter(

                    item =>

                        item.title ||
                        item.description ||
                        item.technologies.length > 0

                )

            : [];


    return {

        name:
            safeString(
                data.name
            ),

        email:
            safeString(
                data.email
            ),

        phone:
            safeString(
                data.phone
            ),

        skills:
            normalizeUniqueArray(
                data.skills
            ),

        education,

        experience,

        projects,

        certifications:
            normalizeUniqueArray(
                data.certifications
            )

    };

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

                success:
                    false,

                message:
                    "User authentication required."

            });

        }


        const resumes =
            await Resume.find({

                user:
                    req.user.id

            }).sort({

                createdAt:
                    -1

            });


        let readinessScore =
            0;


        let suggestions =
            [];


        // =================================================
        // LATEST RESUME
        // =================================================

        if (
            resumes.length > 0
        ) {

            const latestResume =
                resumes[0];


            const atsScore =
                Math.min(

                    100,

                    Math.max(

                        0,

                        Number(
                            latestResume.atsScore
                        ) || 0

                    )

                );


            readinessScore =
                atsScore;


            // =================================================
            // ATS SUGGESTIONS
            // =================================================

            if (
                atsScore < 70
            ) {

                suggestions.push(

                    "Improve ATS keywords and tailor your resume to the target job."

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


            // =================================================
            // PARSED DATA SUGGESTIONS
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


                if (
                    !Array.isArray(
                        parsed.education
                    ) ||
                    parsed.education.length === 0
                ) {

                    suggestions.push(

                        "Add your education details."

                    );

                }


                if (
                    !Array.isArray(
                        parsed.skills
                    ) ||
                    parsed.skills.length < 5
                ) {

                    suggestions.push(

                        "Add more relevant skills that you genuinely possess."

                    );

                }


                if (
                    Array.isArray(
                        parsed.experience
                    ) &&
                    parsed.experience.length > 0
                ) {

                    const hasDescription =
                        parsed.experience.some(

                            experience =>

                                hasText(
                                    experience?.description
                                )

                        );


                    if (
                        !hasDescription
                    ) {

                        suggestions.push(

                            "Add clear descriptions of your experience and achievements."

                        );

                    }

                }

            }


            // =================================================
            // EXCELLENT RESUME
            // =================================================

            if (
                atsScore >= 90 &&
                suggestions.length === 0
            ) {

                suggestions.push(

                    "Excellent resume. Keep it updated."

                );

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


        return res.status(200).json({

            success:
                true,

            resumes,

            readinessScore,

            suggestions

        });


    } catch (error) {

        console.error(

            "Get Resumes Error:",

            error.message

        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to fetch resumes."

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
        // AUTH
        // =================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success:
                    false,

                message:
                    "User authentication required."

            });

        }


        // =================================================
        // ID VALIDATION
        // =================================================

        const resumeId =
            req.params.id;


        if (
            !mongoose.Types.ObjectId.isValid(
                resumeId
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Invalid resume ID."

            });

        }


        // =================================================
        // FIND USER'S RESUME
        // =================================================

        const resume =
            await Resume.findOne({

                _id:
                    resumeId,

                user:
                    req.user.id

            });


        if (
            !resume
        ) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Resume not found."

            });

        }


        // =================================================
        // DELETE DATABASE
        // =================================================

        await resume.deleteOne();


        // =================================================
        // DELETE CLOUDINARY
        // =================================================

        await deleteFromCloudinary(

            resume.cloudinaryPublicId

        );


        return res.status(200).json({

            success:
                true,

            message:
                "Resume deleted successfully."

        });


    } catch (error) {

        console.error(

            "Delete Resume Error:",

            error.message

        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to delete resume."

        });

    }

};


// =====================================================
// SAFE STRING
// =====================================================

const safeString = (
    value
) => {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    )
        .trim()
        .slice(
            0,
            2000
        );

};


// =====================================================
// CHECK TEXT
// =====================================================

const hasText = (
    value
) => {

    return (

        value !== null &&
        value !== undefined &&
        String(value).trim().length > 0

    );

};


// =====================================================
// VALID EMAIL
// =====================================================

const hasValidEmail = (
    email
) => {

    if (
        !hasText(email)
    ) {

        return false;

    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(

        String(email).trim()

    );

};


// =====================================================
// NORMALIZE ARRAY
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
                safeString(
                    item
                )

        )

        .filter(
            Boolean
        )

        .slice(
            0,
            100
        );

};


// =====================================================
// NORMALIZE UNIQUE ARRAY
// =====================================================

const normalizeUniqueArray = (
    value
) => {

    const items =
        normalizeArray(
            value
        );


    const seen =
        new Set();


    const result =
        [];


    for (
        const item
        of items
    ) {

        const key =
            item.toLowerCase();


        if (
            seen.has(
                key
            )
        ) {

            continue;

        }


        seen.add(
            key
        );


        result.push(
            item
        );

    }


    return result;

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    uploadResume,

    parseResumeWithAI,

    getMyResumes,

    deleteResume

};