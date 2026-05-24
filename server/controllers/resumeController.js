const fs = require("fs");
const pdfParse = require("pdf-parse");
const Interview = require("../models/Interview");
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
        Analyze this resume and return ONLY valid JSON.

        Format:

        {
        "questions": [],
        "strengths": [],
        "weaknesses": [],
        "roles": []
        }

        Generate:
        - 5 technical interview questions
        - 3 strengths
        - 3 weaknesses
        - 3 suggested job roles

        Resume:
        ${resumeText}
        `;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const rawText = result.text;

        const cleanedText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const response = JSON.parse(cleanedText);
        await Interview.create({

            user: req.user.id,

            resumeName: file.originalname,

            analysis: response,
        });
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