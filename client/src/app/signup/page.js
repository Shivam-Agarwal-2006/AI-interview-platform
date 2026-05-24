"use client";

import { useState } from "react";
import axios from "axios";

export default function SignupPage() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                formData
            );

            alert(res.data.message);

        } catch (error) {

            console.log(error);

            alert(error.response.data.message);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-[300px]"
            >

                <h1 className="text-3xl font-bold text-center">
                    Signup
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="border p-2"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2"
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="bg-black text-white p-2"
                >
                    Signup
                </button>

            </form>

        </div>
    );
}