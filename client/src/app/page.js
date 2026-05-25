"use client";

import Link from "next/link";

export default function HomePage() {

    return (

        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white">


            {/* NAVBAR */}

            <nav className="flex justify-between items-center px-10 py-6">

                <h1 className="text-3xl font-bold text-blue-400">
                    AI Interview Platform
                </h1>

                <div className="space-x-4">

                    <Link href="/login">

                        <button className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                            Login
                        </button>

                    </Link>

                    <Link href="/signup">

                        <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
                            Signup
                        </button>

                    </Link>

                </div>

            </nav>


            {/* HERO SECTION */}

            <section className="flex flex-col items-center justify-center text-center px-6 pt-24">

                <h1 className="text-6xl font-extrabold leading-tight max-w-5xl">

                    Crack Your Next
                    <span className="text-blue-400"> Technical Interview </span>
                    With AI

                </h1>

                <p className="text-gray-300 text-xl mt-8 max-w-3xl leading-9">

                    Upload your resume and instantly receive:
                    AI-generated interview questions,
                    skill analysis,
                    strengths,
                    weaknesses,
                    and personalized role suggestions.

                </p>

                <div className="flex gap-6 mt-10">

                    <Link href="/signup">

                        <button className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl text-xl font-semibold transition">
                            Get Started
                        </button>

                    </Link>

                    <Link href="/login">

                        <button className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-xl text-xl font-semibold transition">
                            Live Demo
                        </button>

                    </Link>

                </div>

            </section>


            {/* FEATURES */}

            <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 py-28">

                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:scale-105 transition">

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        AI Resume Analysis
                    </h2>

                    <p className="text-gray-300 leading-8">
                        Analyze resumes intelligently using Gemini AI and extract meaningful technical insights.
                    </p>

                </div>


                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:scale-105 transition">

                    <h2 className="text-2xl font-bold text-green-400 mb-4">
                        Interview Preparation
                    </h2>

                    <p className="text-gray-300 leading-8">
                        Generate personalized technical interview questions based on real resume skills.
                    </p>

                </div>


                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:scale-105 transition">

                    <h2 className="text-2xl font-bold text-purple-400 mb-4">
                        Smart Recommendations
                    </h2>

                    <p className="text-gray-300 leading-8">
                        Discover your strengths, weaknesses, and most suitable software roles instantly.
                    </p>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="text-center text-gray-400 py-10 border-t border-gray-700">

                Built with Next.js, Node.js, MongoDB, and Gemini AI

            </footer>

        </div>
    );
}