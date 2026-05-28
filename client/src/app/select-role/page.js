"use client";

import { useState } from "react";

export default function SelectRolePage() {

    const [selectedRole, setSelectedRole] = useState("");

    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DSA Interview",
        "HR Interview",
        "Machine Learning Engineer",
    ];

    const handleContinue = () => {

        if (!selectedRole) {
            alert("Please select a role");
            return;
        }

        localStorage.setItem("selectedRole", selectedRole);

        window.location.href = "/dashboard";
    };

    return (

        <div className="min-h-screen bg-black text-white flex items-center justify-center p-10">

            <div className="bg-gray-900 p-10 rounded-3xl border border-gray-800 w-full max-w-xl">

                <h1 className="text-5xl font-bold mb-6">
                    Select Interview Role
                </h1>

                <p className="text-gray-400 mb-8 text-lg">
                    Choose the role you want to prepare for
                </p>

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 p-5 rounded-2xl text-lg outline-none"
                >

                    <option value="">
                        Select Role
                    </option>

                    {roles.map((role, index) => (

                        <option key={index} value={role}>
                            {role}
                        </option>

                    ))}

                </select>


                <button
                    onClick={handleContinue}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-500 transition-all py-4 rounded-2xl text-xl font-bold"
                >
                    Continue
                </button>

            </div>

        </div>
    );
}