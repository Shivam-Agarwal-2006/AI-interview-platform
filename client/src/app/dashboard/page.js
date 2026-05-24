"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {

    const router = useRouter();

    const [user, setUser] = useState(null);

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

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
    };

    return (
        <div className="p-10">

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2"
                >
                    Logout
                </button>

            </div>

            <div className="mt-10">

                <h2 className="text-2xl">
                    Welcome {user?.name}
                </h2>

                <p className="mt-2 text-gray-600">
                    Email: {user?.email}
                </p>

            </div>

        </div>
    );
}