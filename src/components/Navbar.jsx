import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search.jsx";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="w-full bg-gray-800 text-gray-200 font-mono">
            <div className="max-w-screen-lg mx-auto p-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold tracking-wide text-white">
                    CINEPOST
                </Link>

                <div className="flex gap-6 items-center font-bold text-xl text-white">
                    <Link to="/" className="hover:text-blue-500 transition">Home</Link>
                    <Link to="/sessions" className="hover:underline">Sessions</Link>
                    <Link to="/favorites" className="hover:text-blue-500 transition">Favorites</Link>
                    <Search />
                    {user ? (
                        <Link to="/profile" className="hover:text-blue-500">Profile</Link>
                    ) : (
                        <Link to="/login" className="hover:text-blue-500 transition">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}