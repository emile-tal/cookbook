"use client"

import { register } from "../api/register/route";
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
            setError("Invalid credentials");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" />
                {signup &&
                    <>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" />
                    </>}
                <label htmlFor="password">Password</label>
                <input type="password" name="password" />
                <button type="submit">{signup ? "Signup" : "Login"}</button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={() => setSignup(!signup)} className="text-gray-500">
                {signup ? "Already have an account? Login here" : "Don't have an account? Signup here"}
            </button>
        </div>
    )
}