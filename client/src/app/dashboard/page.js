"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {

    const router = useRouter();

    const [user, setUser] = useState(null);

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [analysis, setAnalysis] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a resume");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("resume", file);

            const res = await axios.post(
                "http://localhost:5000/api/resume/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setAnalysis(res.data.analysis);

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

                    <h2 className="text-3xl font-bold mb-6">
                        AI Analysis
                    </h2>

                    <div className="whitespace-pre-wrap text-gray-800 leading-8 text-lg">
                        {analysis}
                    </div>

                </div>
            )}

        </div>
    );
}