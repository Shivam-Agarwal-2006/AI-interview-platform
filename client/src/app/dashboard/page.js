"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {

    const router = useRouter();

    const [user, setUser] = useState(null);

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [analysis, setAnalysis] = useState(null);

    const [history, setHistory] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const role =
            localStorage.getItem("selectedRole");

        if (role) {

            setSelectedRole(role);
        }
        fetchHistory();
    }, []);

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a resume");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();
            const token = localStorage.getItem("token");
            formData.append("resume", file);
            const selectedRole = localStorage.getItem("selectedRole");
            formData.append("role", selectedRole);
            const res = await axios.post(
                "http://localhost:5000/api/resume/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setAnalysis(res.data.analysis);
            localStorage.setItem(
                "analysis",
                JSON.stringify(res.data.analysis)
            );

        } catch (error) {

            console.log(error);

            alert("Upload failed");

        } finally {

            setLoading(false);
        }
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
    };
    const fetchHistory = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/interviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setHistory(res.data);

        } catch (error) {

            console.log(error);
        }
    };
    return (

        <div className="min-h-screen bg-gray-100 text-black p-10">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-10">

                <div>

                    <h1 className="text-5xl font-bold text-black">
                        AI Interview Platform
                    </h1>

                    <p className="text-gray-700 mt-3 text-lg">
                        Welcome, {user?.name}
                    </p>

                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    Logout
                </button>

            </div>


            {/* UPLOAD CARD */}

            <div className="bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-3xl font-bold mb-6 text-black">
                    Upload Resume
                </h2>
                <h2 className="text-2xl font-bold mb-6">
                    Preparing for:
                    <span className="text-blue-500">
                        {" "} {selectedRole}
                    </span>
                </h2>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mb-6 border border-gray-300 p-4 rounded-lg w-full bg-white text-black"
                />

                <button
                    onClick={handleUpload}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                    Upload & Analyze
                </button>

            </div>


            {/* LOADING */}

            {loading && (

                <div className="bg-white p-8 rounded-2xl shadow-lg mt-10">

                    <div className="flex items-center gap-4">

                        <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

                        <p className="text-xl font-semibold">
                            AI is analyzing your resume...
                        </p>

                    </div>

                </div>
            )}


            {/* ANALYSIS */}
            {analysis && (

                <div className="bg-white p-8 rounded-2xl shadow-lg mt-10">

                    <div className="flex flex-col items-center">

                        <h2 className="text-4xl font-bold mb-4">
                            Resume Score
                        </h2>

                        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">

                            <div
                                className="bg-green-500 h-8 flex items-center justify-center text-white font-bold transition-all duration-1000"
                                style={{
                                    width: `${analysis.score}%`,
                                }}
                            >
                                {analysis.score}%
                            </div>

                        </div>

                    </div>


                    {/* CATEGORY SCORES */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">


                        <div className="bg-blue-100 p-6 rounded-xl">

                            <h3 className="text-xl font-bold mb-3">
                                Technical Skills
                            </h3>

                            <p className="text-3xl font-bold text-blue-700">
                                {analysis.skillsScore}/100
                            </p>

                        </div>


                        <div className="bg-purple-100 p-6 rounded-xl">

                            <h3 className="text-xl font-bold mb-3">
                                Projects
                            </h3>

                            <p className="text-3xl font-bold text-purple-700">
                                {analysis.projectsScore}/100
                            </p>

                        </div>


                        <div className="bg-green-100 p-6 rounded-xl">

                            <h3 className="text-xl font-bold mb-3">
                                Experience
                            </h3>

                            <p className="text-3xl font-bold text-green-700">
                                {analysis.experienceScore}/100
                            </p>

                        </div>


                        <div className="bg-red-100 p-6 rounded-xl">

                            <h3 className="text-xl font-bold mb-3">
                                Communication
                            </h3>

                            <p className="text-3xl font-bold text-red-700">
                                {analysis.communicationScore}/100
                            </p>

                        </div>

                    </div>

                </div>
            )}
            {analysis && (

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">


                    {/* QUESTIONS */}

                    <div className="bg-white p-8 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-6 text-blue-600">
                            Technical Questions
                        </h2>

                        <ul className="space-y-4">

                            {analysis.questions.map((question, index) => (

                                <li
                                    key={index}
                                    className="bg-gray-100 p-4 rounded-lg"
                                >
                                    {question}
                                </li>
                            ))}

                        </ul>

                    </div>


                    {/* STRENGTHS */}

                    <div className="bg-white p-8 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-6 text-green-600">
                            Strengths
                        </h2>

                        <ul className="space-y-4">

                            {analysis.strengths.map((strength, index) => (

                                <li
                                    key={index}
                                    className="bg-green-100 p-4 rounded-lg"
                                >
                                    {strength}
                                </li>
                            ))}

                        </ul>

                    </div>


                    {/* WEAKNESSES */}

                    <div className="bg-white p-8 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-6 text-red-600">
                            Weaknesses
                        </h2>

                        <ul className="space-y-4">

                            {analysis.weaknesses.map((weakness, index) => (

                                <li
                                    key={index}
                                    className="bg-red-100 p-4 rounded-lg"
                                >
                                    {weakness}
                                </li>
                            ))}

                        </ul>

                    </div>


                    {/* ROLES */}

                    <div className="bg-white p-8 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-6 text-purple-600">
                            Suggested Roles
                        </h2>

                        <ul className="space-y-4">

                            {analysis.roles.map((role, index) => (

                                <li
                                    key={index}
                                    className="bg-purple-100 p-4 rounded-lg"
                                >
                                    {role}
                                </li>
                            ))}

                        </ul>

                    </div>

                </div>
            )}
            <div className="mt-10 flex justify-center gap-4">

                <button
                    onClick={() => router.push("/mock-interview")}
                    className="bg-black text-white px-10 py-4 rounded-xl text-xl font-semibold hover:bg-gray-800"
                >
                    Start Mock Interview
                </button>

                <button
                    onClick={() => router.push("/history")}
                    className="bg-purple-600 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:bg-purple-700"
                >
                    Interview History
                </button>

            </div>
            {history.length > 0 && (

                <div className="mt-16">

                    <h2 className="text-4xl font-bold mb-8">
                        Previous Analyses
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {history.map((item) => (

                            <div
                                key={item._id}
                                className="bg-white p-6 rounded-2xl shadow-lg"
                            >

                                <h3 className="text-2xl font-bold mb-3">
                                    {item.resumeName}
                                </h3>

                                <p className="text-gray-600">
                                    Questions Generated:
                                    {" "}
                                    {item.analysis.questions.length}
                                </p>

                                <p className="text-gray-600 mt-2">
                                    Suggested Roles:
                                    {" "}
                                    {item.analysis.roles.join(", ")}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>
            )}
        </div>
    );
}