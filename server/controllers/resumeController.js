const Resume = require("../models/Resume");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const ai = require("../config/gemini");

// =====================================================
// UPLOAD RESUME
// =====================================================
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No Resume Uploaded",
            });
        }

        // Dummy ATS Score for now
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

    } catch (error) {
        console.log("Upload Resume Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// PARSE RESUME WITH GEMINI AI
// =====================================================
const parseResumeWithAI = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check File
        // -------------------------------------------------
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No Resume Uploaded",
            });
        }


        // -------------------------------------------------
        // Read Uploaded PDF
        // -------------------------------------------------
        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);


        // -------------------------------------------------
        // Extract Text From PDF
        // -------------------------------------------------
        const pdfData = await pdfParse(dataBuffer);

        const resumeText = pdfData.text;


        // -------------------------------------------------
        // Debug: Show Extracted Text
        // -------------------------------------------------
        console.log("=================================");
        console.log("EXTRACTED RESUME TEXT");
        console.log("=================================");
        console.log(resumeText);
        console.log("=================================");


        // -------------------------------------------------
        // Check Extracted Text
        // -------------------------------------------------
        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from resume",
            });
        }


        // =================================================
        // GEMINI PROMPT
        // =================================================

        const prompt = `
You are an expert professional resume parser.

Analyze the COMPLETE resume text below.

Your job is to extract ALL information that is actually present in the resume.

IMPORTANT RULES:

1. Search the ENTIRE resume before deciding information is missing.

2. Do NOT invent information.

3. Do NOT guess information.

4. Preserve the original information whenever possible.

5. Extract the person's full name.

6. Extract the email address.

7. Extract the phone number.

8. Extract ALL technical skills.

9. Extract ALL non-technical skills when present.

10. Extract ALL education entries.

11. Extract institution name.

12. Extract degree.

13. Extract dates.

14. Extract CGPA or percentage if available.

15. Extract ALL work experience.

16. Extract internships.

17. Extract academic experience.

18. Extract laboratory experience.

19. Extract leadership positions.

20. Extract club positions.

21. Extract volunteer experience.

22. Extract organization names.

23. Extract experience dates if available.

24. Extract ALL projects.

25. Extract project descriptions.

26. Extract project technologies.

27. Extract ALL certifications.

28. Do not ignore sections simply because they are short.

29. If an experience section contains leadership or club activities, include them under experience.

30. If information is genuinely not present, return an empty string or empty array.

EMAIL RULE:

Look carefully for email addresses such as:

example@gmail.com
name@outlook.com
name@yahoo.com

PHONE RULE:

Look carefully for phone numbers such as:

+91 9876543210
+91-9876543210
9876543210

Return ONLY valid JSON.

DO NOT return markdown.

DO NOT return \`\`\`json.

DO NOT add explanations before or after the JSON.

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
        // CALL GEMINI
        // =================================================

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });


        // -------------------------------------------------
        // Gemini Raw Response
        // -------------------------------------------------
        let result = response.text;


        console.log("=================================");
        console.log("GEMINI RAW RESPONSE");
        console.log("=================================");
        console.log(result);
        console.log("=================================");


        // -------------------------------------------------
        // Remove Markdown Code Blocks
        // -------------------------------------------------
        result = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


        // -------------------------------------------------
        // Convert Gemini Response To JSON
        // -------------------------------------------------
        const parsedResume = JSON.parse(result);

// Save parsed resume data in MongoDB
const resume = await Resume.findOneAndUpdate(
    {
        user: req.user.id,
    },
    {
        parsedData: parsedResume,
    },
    {
        new: true,
        sort: { uploadedAt: -1 },
    }
);

res.status(200).json({
    success: true,
    message: "Resume Parsed Successfully",
    data: parsedResume,
});


    } catch (error) {

        console.log("AI Resume Parsing Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// GET MY RESUMES
// =====================================================
const getMyResumes = async (req, res) => {
    try {

        const resumes = await Resume.find({
            user: req.user.id,
        }).sort({
            uploadedAt: -1,
        });


        let readinessScore = 0;

        let suggestions = [];


        // -------------------------------------------------
        // Calculate Readiness Score
        // -------------------------------------------------
        if (resumes.length > 0) {

            const latestResume = resumes[0];


            readinessScore = Math.min(
                100,
                latestResume.atsScore + 10
            );


            // -------------------------------------------------
            // Suggestions
            // -------------------------------------------------

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


    } catch (error) {

        console.log("Get Resumes Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// DELETE RESUME
// =====================================================
const deleteResume = async (req, res) => {
    try {

        const resume = await Resume.findById(
            req.params.id
        );


        // -------------------------------------------------
        // Resume Not Found
        // -------------------------------------------------
        if (!resume) {

            return res.status(404).json({
                success: false,
                message: "Resume Not Found",
            });

        }


        // -------------------------------------------------
        // Check Ownership
        // -------------------------------------------------
        if (
            resume.user.toString() !== req.user.id
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });

        }


        // -------------------------------------------------
        // Delete Database Record
        // -------------------------------------------------
        await Resume.findByIdAndDelete(
            req.params.id
        );


        // -------------------------------------------------
        // Delete Physical File
        // -------------------------------------------------
        const filePath = `uploads/${resume.resumeUrl}`;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }


        // -------------------------------------------------
        // Response
        // -------------------------------------------------
        res.status(200).json({
            success: true,
            message: "Resume Deleted Successfully",
        });


    } catch (error) {

        console.log("Delete Resume Error:", error);

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
    uploadResume,
    parseResumeWithAI,
    getMyResumes,
    deleteResume,
};