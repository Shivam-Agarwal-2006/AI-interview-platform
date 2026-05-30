"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function HistoryPage() {

    const [history, setHistory] =
        useState([]);

    useEffect(() => {

        fetchHistory();

    }, []);

    const fetchHistory = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/interview-results/history",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setHistory(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="min-h-screen bg-black text-white p-10">

            <h1 className="text-5xl font-bold mb-10">
                Interview History
            </h1>

            <div className="space-y-6">

                {history.map((item) => (

                    <div
                        key={item._id}
                        className="bg-gray-900 rounded-3xl p-6"
                    >

                        <h2 className="text-2xl font-bold">
                            {item.role}
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Company:
                            {" "}
                            {item.company}
                        </p>

                        <p className="text-gray-400">
                            Score:
                            {" "}
                            {item.averageScore.toFixed(1)}
                            /10
                        </p>

                        <p className="text-gray-400">
                            Questions:
                            {" "}
                            {item.totalQuestions}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}