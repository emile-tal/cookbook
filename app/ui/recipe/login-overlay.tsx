'use client'

import PrimaryButton from "../buttons/primary-button"

export default function LoginOverlay({ handleLogin }: { handleLogin: () => void }) {

    return (
        <div className="absolute inset-0 z-50">
            <div className="absolute inset-0 bg-gray-50/70 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Join the Conversation
                    </h3>
                    <p className="text-gray-600 mb-4">
                        You must be logged in to add a rating and comment on this recipe.
                    </p>
                    <div className="flex justify-center">
                        <PrimaryButton
                            text="Log In"
                            type="button"
                            onClick={handleLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 