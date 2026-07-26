const ai = require("../config/gemini");

const testGemini = async (req, res) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: "Say Hello from Gemini AI",
        });

        res.status(200).json({
            success: true,
            response: response.text,
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
    testGemini,
};