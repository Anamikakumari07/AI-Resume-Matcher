const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error(
        "GEMINI_API_KEY is missing from .env"
    );
}

const ai = new GoogleGenAI({
    apiKey,
});

module.exports = ai;