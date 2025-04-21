"use client";

import { useState, useTransition } from "react";

import Link from "next/link";
import { changePassword } from "@/app/actions/auth";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match");
            return;
        }

        startTransition(async () => {
            const res = await changePassword(currentPassword, newPassword);
            setMessage(res.success ? "Password updated successfully!" : (res.error as string) || "Something went wrong");
            setIsSuccess(res.success);
        });
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 min-w-72">
                <div className="text-green-600 text-center">
                    <p className="text-lg font-medium">Password updated successfully!</p>
                </div>
                <Link
                    href="/profile"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                    Return to Profile
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 min-w-72">
            <div className="min-w-full">
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                    Current Password
                </label>
                <input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="min-w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
            <div className="min-w-full">
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                    New Password
                </label>
                <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="min-w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
            <div className="min-w-full">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="min-w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
            <div className="flex justify-center min-w-full pt-8">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Updating..." : "Change Password"}
                </button>
            </div>
            {!message.includes("updated") && (
                <div className={`text-sm text-red-500`}>
                    {message}
                </div>
            )}
        </form>
    );
}
