const { GoogleGenAI } = require("@google/genai");

const apiKey =
    process.env.GEMINI_API_KEY;


if (!apiKey) {

    console.error(
        "GEMINI_API_KEY is missing from environment variables."
    );

    throw new Error(
        "GEMINI_API_KEY is not configured."
    );

}


const ai =
    new GoogleGenAI({

        apiKey,

    });


module.exports = ai;