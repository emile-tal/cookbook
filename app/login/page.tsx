"use client"

import { register } from "../actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [signup, setSignup] = useState<boolean>(false);
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); // Clear any previous errors
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (signup) {
            const username = formData.get("username") as string;
            const result = await register(email, password, username);
            if (!result.success) {
                setError(result.error as string || "Registration failed");
                return;
            }
            // Registration successful, proceed with sign in
        }

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            if (result?.error) {
                setError("Invalid credentials")
                return
            }
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error(error)
            setError("Invalid credentials");
        }
    }

    return (
        <div className="flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md w-[22.5rem]">
                <div>
                    <h2 className="mt-6 text-center text-2xl font-bold text-text">
                        {signup ? "Create your account" : "Sign in to your account"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {signup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setSignup(!signup)}
                            className="font-medium text-text hover:text-gray-700"
                        >
                            {signup ? "Sign in" : "Sign up"}
                        </button>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block min-w-full px-3 py-2 mt-1 border border-gray-100 rounded-xl placeholder-gray-500 text-text focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                        {signup && (
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-text">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none relative block min-w-full px-3 py-2 mt-1 border border-gray-100 rounded-xl placeholder-gray-500 text-text focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 focus:z-10 sm:text-sm"
                                    placeholder="Choose a username"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block min-w-full px-3 py-2 mt-1 border border-gray-100 rounded-xl placeholder-gray-500 text-text focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-text hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-200"
                        >
                            {signup ? "Create account" : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}