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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;

        const canInsert = await sql`
        SELECT 1
        FROM recipebooks rb
        LEFT JOIN permissions p ON rb.id = p.book_id
        JOIN recipes r ON r.id = ${recipeId}
        WHERE rb.id = ${bookId}
          AND (
            rb.user_id = ${user.id} OR
            (p.user_id = ${user.id} AND p.can_edit = true)
          )
          AND (
            r.user_id = ${user.id} OR
            r.is_public = true
          )
      `;

        if (canInsert.length === 0) {
            return {
                result: 'error',
                message: 'You do not have permission to add this recipe to the book',
            };
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;

        const canDelete = await sql`
        SELECT 1
        FROM recipebooks rb
        LEFT JOIN permissions p ON rb.id = p.book_id
        WHERE rb.id = ${bookId}
          AND (
            rb.user_id = ${user.id} OR
            (p.user_id = ${user.id} AND p.can_edit = true)
          )
      `;

        if (canDelete.length === 0) {
            return {
                result: 'error',
                message: 'You do not have permission to remove this recipe from the book',
            };
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;

        await sql`DELETE FROM recipes WHERE id = ${id} AND user_id = ${user.id} `;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}