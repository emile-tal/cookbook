'use server'

import { Comment } from '@/app/types/definitions';
import sql from '../db';

export async function fetchComments(recipeId: string) {
    try {
        const comments = await sql<Comment[]>`
            SELECT 
                comments.id, 
                comments.comment, 
                comments.created_at, 
                users.username, 
                users.user_image_url
            FROM comments 
            JOIN users ON comments.user_id = users.id
            WHERE comments.recipe_id = ${recipeId}
            ORDER BY comments.created_at DESC
        `;
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

export async function createComment({ recipe_id, user_id, comment }: { recipe_id: string, user_id: string, comment: string }) {
    try {
        await sql`
            INSERT INTO comments (recipe_id, user_id, comment)
            VALUES (${recipe_id}, ${user_id}, ${comment})
        `;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}