"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
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
                "http://localhost:5000/api/auth/login",
                formData
            );

            // store token
            localStorage.setItem("token", res.data.token);

            // store user
            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            alert("Login Successful");

            router.push("/dashboard");

        } catch (error) {

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
                    Login
                </h1>

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
                    Login
                </button>

            </form>

        </div>
    );
}