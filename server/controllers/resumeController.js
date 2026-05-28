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
        const role = req.body.role;


        // prompt
        const prompt = `
Analyze this resume and respond ONLY in valid JSON format.

Return:

{
  "score": number,
  "skillsScore": number,
  "projectsScore": number,
  "experienceScore": number,
  "communicationScore": number,

  "questions": [],
  "strengths": [],
  "weaknesses": [],
  "roles": []
}

Rules:
- score should be out of 100
- category scores should be out of 100
- Generate 5 interview questions specifically for a ${role} role.
  Questions should match the role requirements and technologies commonly asked in interviews.
- generate 3 strengths
- generate 3 weaknesses
- generate 3 suitable roles

Resume Text:
${resumeText}
`;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,

            generationConfig: {
                responseMimeType: "application/json",
            },
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