'use server'

import { createLogByRecipeId } from "../lib/data/logs";
import { getCurrentUser } from '../lib/auth';
import sql from '../lib/db';

export async function createLogByBookId(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO recipebooklogs (user_id, book_id) VALUES (${user.id}, ${id})`;
    } catch (error) {
        console.error(`Database error: ${error}`);
    }
}

export async function logBookView(bookId: string) {
    await createLogByBookId(bookId);
}

export async function logRecipeView(recipeId: string) {
    await createLogByRecipeId(recipeId);
}
