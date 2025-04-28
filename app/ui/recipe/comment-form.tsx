'use client'

import { CommentState } from '@/app/actions/comment'
import { addComment } from '@/app/actions/comment'
import { useActionState } from 'react'

export default function CommentForm({ recipeId, loggedIn }: { recipeId: string, loggedIn: boolean }) {
    const initialState: CommentState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(addComment, initialState)

    return (
        <form action={dispatch} className="mb-8 border-b border-gray-200 pb-12">
            <div className="space-y-4">
                {state?.message && !state.message.includes('successfully') && (
                    <div className={`text-sm text-red-500 bg-red-50 p-3 rounded-lg`}>
                        {state.message}
                    </div>
                )}
                <div>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className={`min-w-full text-sm md:text-base rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 ${!loggedIn && 'pointer-events-none'}`}
                        placeholder="Share your thoughts about this recipe..."
                    />
                    {state?.errors?.comment && (
                        <div className="text-red-500 text-sm mt-2">{state.errors.comment}</div>
                    )}
                </div>
                <input type="hidden" name="recipeId" value={recipeId} />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium ${loggedIn ? 'cursor-pointer' : 'pointer-events-none'}`}
                    >
                        Post Comment
                    </button>
                </div>
            </div>
        </form>
    )
} 