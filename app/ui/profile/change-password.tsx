"use client";

import { useState, useTransition } from "react";

import PrimaryButton from "../buttons/primary-button";
import SecondaryButton from "../buttons/secondary-button";
import { changePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function ChangePassword({ id }: { id: string }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

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
                <PrimaryButton
                    onClick={() => router.push("/profile")}
                    type="button"
                    text="Return to Profile"
                />
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
            <div className="flex justify-center min-w-full pt-8 gap-8">
                <SecondaryButton
                    onClick={() => router.push(`/profile/${id}/edit`)}
                    text="Cancel"
                />
                <PrimaryButton
                    type="submit"
                    text={isPending ? "Updating..." : "Change Password"}
                    disabled={isPending}
                />
            </div>
            {!message.includes("updated") && (
                <div className={`text-sm text-red-500`}>
                    {message}
                </div>
            )}
        </form>
    );
}
