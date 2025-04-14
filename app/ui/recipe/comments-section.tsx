import AddRating from '@/app/components/AddRating'
import CommentForm from '@/app/ui/recipe/comment-form'
import CommentsList from '@/app/ui/recipe/comments-list'
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mb-8 grid grid-cols-4">
            {user && (
                <div className="col-span-1">
                    <h2 className="text-2xl font-bold mb-4">Rating</h2>
                    <AddRating recipeId={recipeId} userRating={userRating} />
                </div>
            )}
            <div className={`${user ? 'col-span-3' : 'col-span-4'}`}>
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                {user && <CommentForm recipeId={recipeId} />}
                <Suspense fallback={<div className="text-gray-500">Loading comments...</div>}>
                    <Comments recipeId={recipeId} />
                </Suspense>
            </div>
        </div>
    )
}