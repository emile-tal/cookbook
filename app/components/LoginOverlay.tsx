'use client'

import { useRouter } from 'next/navigation'

export default function LoginOverlay() {
    const router = useRouter()

    const handleLogin = () => {
        console.log('Logging in...')
        // TODO: Implement actual login functionality
    }

    return (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Join the Conversation
                    </h3>
                    <p className="text-gray-600 mb-4">
                        You must be logged in to add a rating and comment on this recipe.
                    </p>
                    <button
                        onClick={handleLogin}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium pointer-events-auto"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>
    )
} 