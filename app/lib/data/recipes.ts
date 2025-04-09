'use server'

import { LiteRecipe, Recipe } from '../../types/definitions'

import { getCurrentUser } from '../auth';
import sql from '../db';

export async function fetchRecipeById(id: string) {
    try {
        const recipe = await sql<Recipe[]>`
        WITH recipe_base AS (
            SELECT 
                recipes.id, 
                recipes.title,  
                recipes.image_url, 
                recipes.is_public,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = ${id}
        ),
        recipe_ingredients AS (
            SELECT 
                recipe_id,
                json_agg(json_build_object(
                    'amount', amount,
                    'ingredient', ingredient
                )) as ingredients
            FROM ingredients
            WHERE recipe_id = ${id}
            GROUP BY recipe_id
        ),
        recipe_instructions AS (
            SELECT 
                recipe_id,
                json_agg(json_build_object(
                    'position', position,
                    'instruction', instruction
                ) ORDER BY position) as instructions
            FROM instructions
            WHERE recipe_id = ${id}
            GROUP BY recipe_id
        ),
        recipe_categories AS (
            SELECT 
                recipe_id,
                array_agg(category) as categories
            FROM recipecategories
            WHERE recipe_id = ${id}
            GROUP BY recipe_id
        )
        SELECT 
            rb.*,
            COALESCE(ri.ingredients, '[]'::json) as ingredients,
            COALESCE(rins.instructions, '[]'::json) as instructions,
            COALESCE(rc.categories, ARRAY[]::text[]) as categories
        FROM recipe_base rb
        LEFT JOIN recipe_ingredients ri ON rb.id = ri.recipe_id
        LEFT JOIN recipe_instructions rins ON rb.id = rins.recipe_id
        LEFT JOIN recipe_categories rc ON rb.id = rc.recipe_id`;
        return recipe[0] || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchRecipesByBookId(id: string) {
    try {
        const recipes = await sql<LiteRecipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT 
                recipes.id, 
                recipes.title, 
                recipes.image_url, 
                COALESCE(users.username, 'Unknown') as username, 
                recipes.duration,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories
            FROM recipeBookRecipes
            JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipeBookRecipes.book_id = ${id}
        `;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

export async function fetchRecipesByBookIdAndQuery(id: string, searchQuery?: string) {
    try {
        const recipes = await sql<LiteRecipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT 
                recipes.id, 
                recipes.title, 
                recipes.image_url, 
                COALESCE(users.username, 'Unknown') as username, 
                recipes.duration,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories
            FROM recipeBookRecipes
            JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipeBookRecipes.book_id = ${id}
            ${searchQuery ? sql`AND (
                recipes.title ILIKE ${`%${searchQuery}%`} OR
                COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
                recipes.duration::text ILIKE ${`%${searchQuery}%`} OR
                EXISTS (
                    SELECT 1 FROM recipecategories rc2 
                    WHERE rc2.recipe_id = recipes.id 
                    AND rc2.category ILIKE ${`%${searchQuery}%`}
                )
            )` : sql``}
        `;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

export async function fetchRecentlyViewedRecipesByUser() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const recentlyViewedRecipes = await sql<Recipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT DISTINCT ON(recipes.id)
                recipes.id,
                recipes.title,
                recipes.description,
                recipes.image_url,
                recipes.is_public,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                recipelogs.opened_at
            FROM recipelogs
            JOIN recipes ON recipelogs.recipe_id = recipes.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipelogs.user_id = ${user.id}
            ORDER BY recipes.id, recipelogs.opened_at DESC
            LIMIT 4
        `;
        return recentlyViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

export async function fetchMostViewedRecipes() {
    try {
        const mostViewedRecipes = await sql<Recipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT DISTINCT ON(recipes.id)
                recipes.id,
                recipes.title,
                recipes.description,
                recipes.image_url,
                recipes.is_public,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                COUNT(recipelogs.recipe_id) as view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipelogs ON recipes.id = recipelogs.recipe_id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipes.is_public = true
            GROUP BY recipes.id, recipes.title, recipes.description, recipes.image_url,
                recipes.is_public, recipes.duration, users.username, rc.categories
            ORDER BY recipes.id, view_count DESC
            LIMIT 4
        `;
        return mostViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

export async function fetchMostViewedRecipesByUser() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const mostViewedRecipes = await sql<Recipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT DISTINCT ON(recipes.id)
                recipes.id,
                recipes.title,
                recipes.description,
                recipes.image_url,
                recipes.is_public,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                COUNT(recipelogs.recipe_id) as view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipelogs ON recipes.id = recipelogs.recipe_id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipelogs.user_id = ${user.id}
            GROUP BY recipes.id, recipes.title, recipes.description, recipes.image_url,
                recipes.is_public, recipes.duration, users.username, rc.categories
            ORDER BY recipes.id, view_count DESC
            LIMIT 4
        `;
        return mostViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

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

export async function fetchAllPublicRecipesByQuery(searchQuery?: string) {
    try {
        const recipes = await sql<Recipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT 
                recipes.id, 
                recipes.title, 
                recipes.description, 
                recipes.image_url, 
                recipes.is_public, 
                recipes.duration, 
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipes.is_public = true
            ${searchQuery ? sql`AND (
                recipes.title ILIKE ${`%${searchQuery}%`} OR
                recipes.description ILIKE ${`%${searchQuery}%`} OR
                COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
                recipes.duration::text ILIKE ${`%${searchQuery}%`} OR
                EXISTS (
                    SELECT 1 FROM recipecategories rc2 
                    WHERE rc2.recipe_id = recipes.id 
                    AND rc2.category ILIKE ${`%${searchQuery}%`}
                )
            )` : sql``}`;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}