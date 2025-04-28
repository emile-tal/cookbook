import AddRating from '@/app/components/AddRating'
import CommentForm from '@/app/ui/recipe/comment-form'
import CommentsList from '@/app/ui/recipe/comments-list'
import Loading from '../loading'
import LoginOverlay from '@/app/components/LoginOverlay'
import { Suspense } from 'react'
import { fetchComments } from '@/app/lib/data/comment'
import { fetchUserRating } from '@/app/lib/data/rating'
import { getCurrentUser } from '@/app/lib/auth'

async function Comments({ recipeId }: { recipeId: string }) {
    const comments = await fetchComments(recipeId)
    return <CommentsList comments={comments} />
}

export default async function CommentSection({ recipeId }: { recipeId: string }) {
    const user = await getCurrentUser()
    const userRating = await fetchUserRating(recipeId) || null
    const loggedIn = user !== null

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mb-8">
            <div className="flex flex-col space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-8 relative">
                <div className="md:col-span-1 md:p-6">
                    <h2 className="text-xl font-bold mb-4">My Rating</h2>
                    <AddRating recipeId={recipeId} userRating={userRating} loggedIn={loggedIn} />
                </div>
                <div className="md:col-span-3 md:p-6">
                    <h2 className="text-xl font-bold mb-4">Comments</h2>
                    <CommentForm recipeId={recipeId} loggedIn={loggedIn} />
                    <Suspense fallback={<Loading size={8} />}>
                        <Comments recipeId={recipeId} />
                    </Suspense>
                </div>
                {!loggedIn && <LoginOverlay />}
            </div>
        </div>
    )
}