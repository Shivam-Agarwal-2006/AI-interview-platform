"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MockInterviewPage() {

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allAnswers, setAllAnswers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [totalScore, setTotalScore] = useState(0);
    const [dynamicQuestionCount, setDynamicQuestionCount] = useState(0);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState("");
    useEffect(() => {

        const savedAnalysis = localStorage.getItem("analysis");

        if (savedAnalysis) {

            const parsed = JSON.parse(savedAnalysis);

            setQuestions(parsed.questions || []);
        }

    }, []);
    useEffect(() => {

        if (
            typeof window !== "undefined" &&
            ("webkitSpeechRecognition" in window ||
                "SpeechRecognition" in window)
        ) {

            const SpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            const recognitionInstance =
                new SpeechRecognition();

            recognitionInstance.continuous = true;

            recognitionInstance.interimResults = false;

            recognitionInstance.lang = "en-US";

            recognitionInstance.onstart = () => {

                setIsListening(true);
            };

            recognitionInstance.onend = () => {

                setIsListening(false);
            };

            recognitionInstance.onresult = (event) => {

                let transcript = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    transcript +=
                        event.results[i][0].transcript + " ";
                }

                setAnswer((prev) => prev + transcript);
            };

            setRecognition(recognitionInstance);
        }

    }, []);
    useEffect(() => {

        if (
            questions.length > 0 &&
            questions[currentQuestionIndex]
        ) {

            speakQuestion(
                questions[currentQuestionIndex]
            );
        }

    }, [currentQuestionIndex, questions.length]);
    const handleSubmitAnswer = async () => {

        if (!answer) return;

        try {

            setLoading(true);

            const token = localStorage.getItem("token");
            window.speechSynthesis.cancel();
            const res = await axios.post(
                "http://localhost:5000/api/interview/evaluate",
                {
                    question: questions[currentQuestionIndex],
                    answer,
                    role: selectedRole,
                    company: selectedCompany,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setFeedback(res.data);
            if (
                res.data.followUpQuestion &&
                dynamicQuestionCount < 3
            ) {

                setQuestions((prev) => {

                    const updatedQuestions = [...prev];

                    updatedQuestions.splice(
                        currentQuestionIndex + 1,
                        0,
                        res.data.followUpQuestion
                    );

                    return updatedQuestions;
                });

                setDynamicQuestionCount((prev) => prev + 1);
            }
            setAllAnswers((prev) => [
                ...prev,
                {
                    question: questions[currentQuestionIndex],
                    answer,
                    feedback: res.data.feedback,
                    improvement: res.data.improvement,
                    score: res.data.score,
                },
            ]);

            setTotalScore((prev) => prev + res.data.score);
        } catch (error) {

            console.log(error);

            alert("Evaluation Failed");

        } finally {

            setLoading(false);
        }
    };

    const saveInterviewResult = async () => {

        try {

            const token =
                localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/interview-results/save",
                {
                    role: selectedRole,
                    company: selectedCompany,
                    averageScore:
                        totalScore / questions.length,
                    totalQuestions:
                        questions.length,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        } catch (error) {

            console.log(
                "Failed to save interview",
                error
            );
        }
    };
    const nextQuestion = () => {

        if (currentQuestionIndex === questions.length - 1) {
            saveInterviewResult();
            setInterviewCompleted(true);
            return;
        }

        setAnswer("");
        setFeedback(null);

        setCurrentQuestionIndex((prev) => prev + 1);
    };
    const startListening = () => {

        if (recognition) {

            recognition.start();
        }
    };
    const stopListening = () => {

        if (recognition) {

            recognition.stop();

            setIsListening(false);
        }
    };
    const speakQuestion = (text) => {

        if (!text) return;

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        window.speechSynthesis.speak(speech);
    };
    const companies = [
        "General",
        "Google",
        "Amazon",
        "Microsoft",
        "Meta",
    ];
    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DSA Interview",
        "HR Interview",
        "Machine Learning Engineer",
    ];
    if (questions.length === 0) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-bold">

                No Questions Found

            </div>
        );
    }
    if (interviewCompleted) {

        const averageScore = (
            totalScore / questions.length
        ).toFixed(1);

        return (

            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">

                <div className="max-w-5xl mx-auto">

                    {/* HEADER */}

                    <div className="text-center mb-14">

                        <h1 className="text-6xl font-bold mb-6">
                            Interview Completed
                        </h1>

                        <p className="text-gray-400 text-xl">
                            Here is your final AI interview report
                        </p>

                    </div>


                    {/* FINAL SCORE */}

                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-10 mb-12 shadow-2xl">

                        <h2 className="text-3xl font-bold mb-4">
                            Final Average Score
                        </h2>

                        <p className="text-7xl font-bold">
                            {averageScore}/10
                        </p>

                    </div>


                    {/* ANSWER HISTORY */}

                    <div className="space-y-8">

                        {allAnswers.map((item, index) => (

                            <div
                                key={index}
                                className="bg-gray-900 border border-gray-800 rounded-3xl p-8"
                            >

                                <h2 className="text-2xl font-bold text-blue-400 mb-4">
                                    Question {index + 1}
                                </h2>

                                <p className="text-gray-300 leading-8 mb-6">
                                    {item.question}
                                </p>


                                <h3 className="text-xl font-bold mb-3">
                                    Your Answer
                                </h3>

                                <p className="text-gray-400 leading-8 mb-6">
                                    {item.answer}
                                </p>


                                <div className="grid md:grid-cols-3 gap-6">


                                    <div className="bg-green-900/30 rounded-2xl p-6">

                                        <h3 className="text-xl font-bold text-green-400 mb-3">
                                            Score
                                        </h3>

                                        <p className="text-5xl font-bold">
                                            {item.score}/10
                                        </p>

                                    </div>


                                    <div className="bg-blue-900/30 rounded-2xl p-6">

                                        <h3 className="text-xl font-bold text-blue-400 mb-3">
                                            Feedback
                                        </h3>

                                        <p className="text-gray-300 leading-8">
                                            {item.feedback}
                                        </p>

                                    </div>


                                    <div className="bg-red-900/30 rounded-2xl p-6">

                                        <h3 className="text-xl font-bold text-red-400 mb-3">
                                            Improvements
                                        </h3>

                                        <p className="text-gray-300 leading-8">
                                            {item.improvement}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

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
                <div className="mt-6">

                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="bg-gray-900 border border-gray-700 px-5 py-3 rounded-2xl text-white outline-none"
                    >

                        <option value="">
                            Select Interview Role
                        </option>

                        {roles.map((role, index) => (

                            <option key={index} value={role}>
                                {role}
                            </option>

                        ))}

                    </select>

                </div>
                <div className="mt-4">

                    <select
                        value={selectedCompany}
                        onChange={(e) =>
                            setSelectedCompany(e.target.value)
                        }
                        className="bg-gray-900 border border-gray-700 px-5 py-3 rounded-2xl text-white outline-none"
                    >

                        <option value="">
                            Select Company
                        </option>

                        {companies.map((company, index) => (

                            <option
                                key={index}
                                value={company}
                            >
                                {company}
                            </option>

                        ))}

                    </select>

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
                        {!isListening ? (

                            <button
                                onClick={startListening}
                                className="bg-purple-600 hover:bg-purple-500 transition-all px-8 py-4 rounded-2xl text-lg font-bold"
                            >
                                🎤 Start Speaking
                            </button>

                        ) : (

                            <button
                                onClick={stopListening}
                                className="bg-red-600 hover:bg-red-500 transition-all px-8 py-4 rounded-2xl text-lg font-bold"
                            >
                                Stop Recording
                            </button>

                        )}
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 transition-all px-8 py-4 rounded-2xl text-lg font-bold"
                        >
                            {loading ? "Evaluating..." : "Submit Answer"}
                        </button>


                        {feedback && (

                            <button
                                onClick={nextQuestion}
                                className="bg-green-600 hover:bg-green-500 transition-all px-8 py-4 rounded-2xl text-lg font-bold"
                            >
                                {currentQuestionIndex === questions.length - 1
                                    ? "Finish Interview"
                                    : "Next Question"}
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