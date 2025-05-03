'use client'

import { CommentState } from '@/app/actions/comment'
import Loading from '../loading'
import PrimaryButton from '../buttons/primary-button'
import { addComment } from '@/app/actions/comment'
import { useActionState } from 'react'
import { useSession } from 'next-auth/react'

export default function CommentForm({ recipeId }: { recipeId: string }) {
    const initialState: CommentState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(addComment, initialState)
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <Loading size={8} />
    }

    return (
        <form action={dispatch} className="mb-8 pb-12">
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
                        className={`min-w-full text-sm md:text-base rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 ${!session && 'pointer-events-none'}`}
                        placeholder="Share your thoughts about this recipe..."
                    />
                    {state?.errors?.comment && (
                        <div className="text-red-500 text-sm mt-2">{state.errors.comment}</div>
                    )}
                </div>
                <input type="hidden" name="recipeId" value={recipeId} />
                <div className="flex justify-end">
                    <PrimaryButton
                        text="Post Comment"
                        type="submit"
                        disabled={!session}
                    />
                </div>
            </div>
        </form>
    )
} 