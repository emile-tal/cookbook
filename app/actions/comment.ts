'use server'

import { createComment } from '@/app/lib/data/comment'
import { getCurrentUser } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CommentSchema = z.object({
    comment: z.string().min(1, 'Comment cannot be empty'),
    recipeId: z.string().min(1, 'Recipe ID is required'),
})

export type CommentState = {
    message: string | null
    errors: {
        comment?: string[]
        recipeId?: string[]
    }
}

export async function addComment(prevState: CommentState, formData: FormData): Promise<CommentState> {
    const user = await getCurrentUser()
    if (!user) {
        return {
            message: 'You must be logged in to comment',
            errors: {},
        }
    }

    const validatedFields = CommentSchema.safeParse({
        comment: formData.get('comment'),
        recipeId: formData.get('recipeId'),
    })

    if (!validatedFields.success) {
        return {
            message: 'Failed to add comment',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { comment, recipeId } = validatedFields.data

    try {
        await createComment({
            recipe_id: recipeId,
            user_id: user.id,
            comment,
        })

        revalidatePath(`/recipe/${recipeId}`)
        return {
            message: 'Comment added successfully',
            errors: {},
        }
    } catch (error) {
        console.error(error)
        return {
            message: 'Failed to add comment',
            errors: {}
        }
    }
}
