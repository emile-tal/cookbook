'use client'

import { useSearchParams } from 'next/navigation'

export default function NotFoundContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || 'Page not found'

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600">{message}</p>
        </div>
    )
} 