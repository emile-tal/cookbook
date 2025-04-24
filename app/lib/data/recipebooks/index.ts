'use server'

import { Book } from '../../../types/definitions'
import { getCurrentUser } from '../../auth';
import sql from '../../db';

export async function addSavedBook(bookId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
        await sql`DELETE FROM recipeBooks WHERE id = ${id} AND user_id = ${user.id}`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

