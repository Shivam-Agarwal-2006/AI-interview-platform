const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


exports.evaluateAnswer = async (req, res) => {

    try {

        const { question, answer, role, company } = req.body;

        if (!question || !answer) {

            return res.status(400).json({
                message: "Question and answer required",
            });
        }


        const prompt = `
You are an expert technical interviewer conducting a real interview.

Interview Role:
${role}

Question:
${question}

Candidate Answer:
${answer}
Company:
${company}
Evaluate the answer professionally.

Also generate ONE intelligent follow-up question based on the candidate's answer.

The follow-up question should:
- dig deeper technically
- ask for reasoning
- ask about tradeoffs
- ask implementation details

Generate follow-up questions according to the company's interview style.

Google:
- deep technical reasoning
- system design thinking
- tradeoffs

Amazon:
- leadership principles
- ownership
- behavioral examples

Microsoft:
- collaboration
- problem solving

Meta:
- performance
- scalability
- execution

General:
- normal technical interviews

Respond ONLY with raw valid JSON.

{
  "score": number,
  "feedback": "",
  "improvement": "",
  "followUpQuestion": ""
}

Rules:
- score out of 10
- feedback concise
- improvement concise
- followUpQuestion must be realistic and technical
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