'use client'

import AddRating from '@/app/components/AddRating'
import { Comment } from '@/app/types/definitions'
import CommentForm from '@/app/ui/recipe/comment-form'
import CommentsList from '@/app/ui/recipe/comments-list'
import Loading from '../loading'
import LoginDialog from '@/app/components/LoginDialog'
import LoginOverlay from '@/app/ui/recipe/login-overlay'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface CommentSectionProps {
    recipeId: string
    userRating: number | null
    comments: Comment[]
}


export default function CommentSection({ recipeId, userRating, comments }: CommentSectionProps) {
    const { data: session, status } = useSession();
    const [loggedInDialog, setLoggedInDialog] = useState(false);
    const pathname = usePathname();

    if (status === 'loading') {
        return <Loading size={8} />
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mb-8">
            <div className="flex flex-col space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-8 relative">
                <div className="md:col-span-1 md:p-6">
                    <h2 className="text-xl font-bold mb-4">My Rating</h2>
                    <AddRating recipeId={recipeId} userRating={userRating} />
                </div>
                <div className="md:col-span-3 md:p-6">
                    <h2 className="text-xl font-bold mb-4">Comments</h2>
                    <CommentForm recipeId={recipeId} />
                </div>
                {!session && <LoginOverlay handleLogin={() => setLoggedInDialog(true)} />}
            </div>
            <div className="md:grid md:grid-cols-4 md:gap-8">
                <div className="hidden md:block md:col-span-1"></div>
                <div className="md:col-span-3 md:px-6">
                    <CommentsList comments={comments} />
                </div>
            </div>
            <LoginDialog open={loggedInDialog} onClose={() => setLoggedInDialog(false)} from={pathname} />
        </div>
    )
}