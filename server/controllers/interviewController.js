const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


exports.evaluateAnswer = async (req, res) => {

    try {

        const { question, answer, role } = req.body;

        if (!question || !answer) {

            return res.status(400).json({
                message: "Question and answer required",
            });
        }


        const prompt = `
You are a technical interviewer.

Evaluate the candidate's answer.
Interview Role:
${role}
Question:
${question}

Answer:
${answer}

Respond ONLY in valid JSON format.

Format:

{
  "score": number,
  "feedback": "string",
  "improvement": "string"
}

Rules:
- score should be out of 10
- feedback should explain what was good
- improvement should explain what can be improved
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


        res.status(200).json(response);

    } catch (error) {

        console.log(error);

        if (error.status === 429) {

            return res.status(429).json({
                message: "AI quota exceeded. Try again later.",
            });
        }

        if (error.status === 503) {

            return res.status(503).json({
                message: "AI model busy. Retry in a few seconds.",
            });
        }

        res.status(500).json({
            message: "Server Error",
        });
    }
};