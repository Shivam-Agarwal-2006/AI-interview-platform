"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MockInterviewPage() {

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const savedAnalysis = localStorage.getItem("analysis");

        if (savedAnalysis) {

            const parsed = JSON.parse(savedAnalysis);

            setQuestions(parsed.questions || []);
        }

    }, []);


    const handleSubmitAnswer = async () => {

        if (!answer) return;

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/api/interview/evaluate",
                {
                    question: questions[currentQuestionIndex],
                    answer,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setFeedback(res.data);

        } catch (error) {

            console.log(error);

            alert("Evaluation Failed");

        } finally {

            setLoading(false);
        }
    };


    const nextQuestion = () => {

        setAnswer("");
        setFeedback(null);

        setCurrentQuestionIndex((prev) => prev + 1);
    };


    if (questions.length === 0) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-bold">

                No Questions Found

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-8">


            <div className="max-w-5xl mx-auto">


                {/* HEADER */}

                <div className="mb-10">

                    <h1 className="text-5xl font-bold mb-3">
                        AI Mock Interview
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Practice technical interviews with AI-powered evaluation
                    </p>

                </div>


                {/* QUESTION CARD */}

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl mb-8">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-2xl font-bold">
                            Question {currentQuestionIndex + 1}
                        </h2>

                        <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                            AI Generated
                        </span>

                    </div>


                    <p className="text-xl leading-10 text-gray-200">
                        {questions[currentQuestionIndex]}
                    </p>

                </div>


                {/* ANSWER BOX */}

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">


                    <h3 className="text-2xl font-bold mb-6">
                        Your Answer
                    </h3>


                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full h-52 bg-gray-950 border border-gray-700 rounded-2xl p-6 text-lg outline-none focus:border-blue-500 resize-none"
                    />


                    {/* BUTTONS */}

                    <div className="flex gap-5 mt-8">

                        <button
                            onClick={handleSubmitAnswer}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 transition-all px-8 py-4 rounded-2xl text-lg font-bold"
                        >
                            {loading ? "Evaluating..." : "Submit Answer"}
                        </button>


                        {feedback && currentQuestionIndex < questions.length - 1 && (

                            <button
                                onClick={nextQuestion}
                                className="bg-green-600 hover:bg-green-500 transition-all px-8 py-4 rounded-2xl text-lg font-bold"
                            >
                                Next Question
                            </button>
                        )}

                    </div>

                </div>


                {/* FEEDBACK SECTION */}

                {feedback && (

                    <div className="grid md:grid-cols-3 gap-6 mt-10">


                        {/* SCORE */}

                        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 shadow-xl">

                            <h3 className="text-2xl font-bold mb-4">
                                Score
                            </h3>

                            <p className="text-6xl font-bold">
                                {feedback.score}/10
                            </p>

                        </div>


                        {/* FEEDBACK */}

                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">

                            <h3 className="text-2xl font-bold mb-4">
                                Feedback
                            </h3>

                            <p className="text-gray-300 leading-8">
                                {feedback.feedback}
                            </p>

                        </div>


                        {/* IMPROVEMENTS */}

                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">

                            <h3 className="text-2xl font-bold mb-4">
                                Improvements
                            </h3>

                            <p className="text-gray-300 leading-8">
                                {feedback.improvement}
                            </p>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}