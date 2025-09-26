"use client";

import { useState, useEffect } from "react";

interface PasswordProtectionProps {
    children: React.ReactNode;
}

const PasswordProtection = ({ children }: PasswordProtectionProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already authenticated
    useEffect(() => {
        const authStatus = localStorage.getItem("app-authenticated");
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Hardcoded password - you can change this password
        const correctPassword = "demo123^";

        if (password === correctPassword) {
            setIsAuthenticated(true);
            localStorage.setItem("app-authenticated", "true");
        } else {
            setError("Incorrect password");
            setPassword("");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("app-authenticated");
        setPassword("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Access Protected
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please enter the password to continue
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Access App
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-xs text-gray-500">
                        Default password: demo123
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Logout button - you can position this wherever you want */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                    Logout
                </button>
            </div>
            {children}
        </div>
    );
};

export default PasswordProtection;
