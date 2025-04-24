import React from 'react'

export default function Home() {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="bg-gray-100 p-8 rounded-lg shadow text-center">
                <h1 className="text-blank font-semibold text-gray-800 mb-2">
                    Tailwind CSS is working
                </h1>
                <p className="text-gray-600">Please us it instead of MUI</p>
            </div>
        </div>
    )
}

