import React from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    if (!user) return null;

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white uppercase">
                        Logged in as: {user.email}
                    </h1>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Sign Out
                    </button>
                </div>
                <div className="bg-gray-800 text-gray-100 p-6 rounded h-64 flex items-center justify-center">
                    {/* Recently viewed movies will appear here */}
                </div>
            </div>
        </div>
    );
}
