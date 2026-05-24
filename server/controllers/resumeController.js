const fs = require("fs");
const pdfParse = require("pdf-parse");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
exports.uploadResume = async (req, res) => {

    try {

        // uploaded file
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // read pdf
        const dataBuffer = fs.readFileSync(file.path);

        // extract text
        const pdfData = await pdfParse(dataBuffer);

        const resumeText = pdfData.text;



        // prompt
        const prompt = `
        Analyze this resume and generate:

        1. 5 technical interview questions
        2. 3 strengths
        3. 3 weaknesses
        4. Suggested job roles

        Resume:
        ${resumeText}
        `;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const response = result.text;

        res.status(200).json({
            message: "Resume analyzed successfully",
            analysis: response,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};