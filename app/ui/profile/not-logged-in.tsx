'use client'

import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';

export default function NotLoggedIn() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <PersonIcon className="text-gray-300 scale-[200%] min-h-16 w-16" />
            <p className="text-gray-600 text-lg mb-4 pt-4">You need to be logged in to view your profile.</p>
            <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            >
                Log in
            </button>
        </div>
    )
} 