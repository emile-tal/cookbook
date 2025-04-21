'use server'

import { Recipe } from '../../../types/definitions'
import { getCurrentUser } from '../../auth';
import sql from '../../db';

export async function addRecipeToBook(bookId: string, recipeId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        // Verify the recipe book belongs to the user
        const book = await sql`
            SELECT * FROM recipebooks WHERE id = ${bookId} AND user_id = ${user.id}
        `;
        if (book.length === 0) {
            return { result: 'error', message: 'Recipe book not found or unauthorized' };
        }

        const existingRecipe = await sql<Recipe[]>`
            SELECT * FROM recipeBookRecipes WHERE book_id = ${bookId} AND recipe_id = ${recipeId}
        `;
        if (existingRecipe.length > 0) {
            return { result: 'error', message: 'Recipe already in book' };
        }
        await sql`INSERT INTO recipeBookRecipes(book_id, recipe_id) VALUES(${bookId}, ${recipeId})`;
        return { result: 'success', message: 'Recipe added to book' };
    } catch (error) {
        console.error(`Database error: ${error} `);
        return { result: 'error', message: 'Failed to add recipe to book' };
    }
}

export async function removeRecipeFromBook(bookId: string, recipeId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        // Verify the recipe book belongs to the user
        const book = await sql`
            SELECT * FROM recipebooks WHERE id = ${bookId} AND user_id = ${user.id}
        `;
        if (book.length === 0) {
            return { result: 'error', message: 'Recipe book not found or unauthorized' };
        }
        const existingRecipe = await sql<Recipe[]>`
        SELECT * FROM recipeBookRecipes WHERE book_id = ${bookId} AND recipe_id = ${recipeId}
    `;
        if (existingRecipe.length === 0) {
            return { result: 'error', message: 'Recipe not in book' };
        }

        await sql`DELETE FROM recipeBookRecipes WHERE book_id = ${bookId} AND recipe_id = ${recipeId}`;
        return { result: 'success', message: 'Recipe removed from book' };
    } catch (error) {
        console.error(`Database error: ${error} `);
        return { result: 'error', message: 'Failed to remove recipe from book' };
    }
}

export async function deleteRecipe(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`DELETE FROM recipes WHERE id = ${id} AND user_id = ${user.id} `;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}