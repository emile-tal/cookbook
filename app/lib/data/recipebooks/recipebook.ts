'use server'

import { Book } from '../../../types/definitions'
import { getCurrentUser } from '../../auth';
import sql from '../../db';

//TODO: Need to optimize this function
export async function fetchRecipeCountForAllBooks() {
    try {
        const recipeCounts = await sql<{ book_id: string, count: number }[]>`
            SELECT book_id, COUNT(recipe_id) as count
            FROM recipeBookRecipes
            GROUP BY book_id
        `;

        // Convert array to a map of book_id -> count
        const countMap: Record<string, number> = {};
        recipeCounts.forEach(item => {
            countMap[item.book_id] = Number(item.count);
        });

        return countMap;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return {};
    }
}

export async function addSavedBook(bookId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO savedrecipebooks (user_id, book_id) VALUES (${user.id}, ${bookId})`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function removeSavedBook(bookId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`DELETE FROM savedrecipebooks WHERE user_id = ${user.id} AND book_id = ${bookId}`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function createBook(name: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO recipeBooks (user_id, name, is_public) VALUES (${user.id}, ${name}, false)`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function createBookWithRecipe(name: string, recipeId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const [book] = await sql<Book[]>`
            INSERT INTO recipeBooks (user_id, name, is_public) 
            VALUES (${user.id}, ${name}, false)
            RETURNING id, name, image_url, user_id, is_public
        `;

        if (book) {
            await sql`INSERT INTO recipeBookRecipes (book_id, recipe_id) VALUES (${book.id}, ${recipeId})`;
            return { success: true, book };
        }
        return { success: false };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function deleteBook(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`DELETE FROM recipeBooks WHERE id = ${id} AND user_id = ${user.id}`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

