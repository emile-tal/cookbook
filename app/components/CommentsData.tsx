'use server'

import { Comment } from '@/app/types/definitions'
import { fetchComments } from '@/app/lib/data/comment'

export async function CommentsData({ recipeId, children }: { recipeId: string, children: (comments: Comment[]) => React.ReactNode }) {
    const comments = await fetchComments(recipeId)

    return children(comments)
} 