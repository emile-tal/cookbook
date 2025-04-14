import CommentsList from './comments-list'
import { Suspense } from 'react'
import { fetchComments } from '@/app/lib/data/comment'

async function Comments({ recipeId }: { recipeId: string }) {
    const comments = await fetchComments(recipeId)
    return <CommentsList comments={comments} />
}

export default function CommentSection({ recipeId }: { recipeId: string }) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <Suspense fallback={<div className="text-gray-500">Loading comments...</div>}>
                <Comments recipeId={recipeId} />
            </Suspense>
        </div>
    )
}