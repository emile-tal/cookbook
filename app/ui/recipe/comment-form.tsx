'use client'

import { CommentState } from '@/app/actions/comment'
import { addComment } from '@/app/actions/comment'
import { useActionState } from 'react'

export default function CommentForm({ recipeId }: { recipeId: string }) {
    const initialState: CommentState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(addComment, initialState)

    return (
        <form action={dispatch} className="mb-6">
            <div className="space-y-4">
                {state?.message && !state.message.includes('successfully') && (
                    <div className={`text-sm text-red-500`}>
                        {state.message}
                    </div>
                )}
                <div>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className="min-w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Share your thoughts about this recipe..."
                    />
                    {state?.errors?.comment && (
                        <div className="text-red-500 text-sm mt-1">{state.errors.comment}</div>
                    )}
                </div>
                <input type="hidden" name="recipeId" value={recipeId} />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        Post Comment
                    </button>
                </div>
            </div>
        </form>
    )
} 