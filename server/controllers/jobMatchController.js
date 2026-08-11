const ai = require("../config/gemini");

const matchResumeWithJob = async (req, res) => {
    try {

        const { resumeText, jobDescription } = req.body;

        if (!resumeText) {
            return res.status(400).json({
                success: false,
                message: "Resume text is required",
            });
        }

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Job description is required",
            });
        }

        const prompt = `
You are an expert AI job matching and resume analysis system.

Compare the resume with the job description.

Analyze:

1. Overall match percentage.
2. Skills that match.
3. Skills missing from the resume.
4. Important keywords missing.
5. Resume improvement suggestions.
6. Job-specific recommendations.

Do not invent information.

Return ONLY valid JSON.

Use exactly this structure:

{
    "matchScore": 0,
    "matchingSkills": [],
    "missingSkills": [],
    "missingKeywords": [],
    "suggestions": [],
    "recommendations": []
}

RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        let result = response.text;

        result = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedResult = JSON.parse(result);

        res.status(200).json({
            success: true,
            message: "Resume Matched Successfully",
            data: parsedResult,
        });

    } catch (error) {

        console.log("AI Job Matching Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    matchResumeWithJob,
};