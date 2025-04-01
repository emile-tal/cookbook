'use server'

import { LiteRecipe, Recipe } from '../../types/definitions'

import { getCurrentUser } from '../auth';
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchAllRecipes() {
    try {
        const recipes = await sql<Recipe[]>`
            SELECT 
                recipes.id, 
                recipes.title, 
                recipes.description, 
                recipes.image_url, 
                recipes.is_public,
                recipes.category,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
        `;
        return recipes || [];
    } catch (error) {
        console.error(`Database error: ${error}`);
        return [];
    }
}

export async function fetchUserRecipes(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const userRecipes = await sql<Recipe[]>`
        SELECT recipes.id, recipes.title, recipes.description, recipes.image_url, recipes.is_public, recipes.category, recipes.duration, COALESCE(users.username, 'Unknown') as username
        FROM recipes
        LEFT JOIN users ON recipes.user_id = users.id
        WHERE recipes.user_id = ${user.id}
        ${searchQuery ? sql`AND (
            recipes.title ILIKE ${`%${searchQuery}%`} OR
            recipes.description ILIKE ${`%${searchQuery}%`} OR
            recipes.category ILIKE ${`%${searchQuery}%`} OR
            COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
            recipes.duration::text ILIKE ${`%${searchQuery}%`}
        )` : sql``}`
        return userRecipes || null
    } catch (error) {
        console.error(`Database error: ${error}`)
        return null
    }
}

export async function fetchRecipeById(id: string) {
    try {
        const recipe = await sql<Recipe[]>`
        WITH recipe_base AS (
            SELECT 
                recipes.id, 
                recipes.title, 
                recipes.description, 
                recipes.image_url, 
                recipes.is_public,
                recipes.category,
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
        )
        SELECT 
            rb.*,
            COALESCE(ri.ingredients, '[]'::json) as ingredients,
            COALESCE(rins.instructions, '[]'::json) as instructions
        FROM recipe_base rb
        LEFT JOIN recipe_ingredients ri ON rb.id = ri.recipe_id
        LEFT JOIN recipe_instructions rins ON rb.id = rins.recipe_id`;

        return recipe[0] || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchRecipesByBookId(id: string, searchQuery?: string) {
    try {
        const recipes = await sql<LiteRecipe[]>`
        SELECT recipes.id, recipes.title, recipes.image_url, COALESCE(users.username, 'Unknown') as username, recipes.category, recipes.duration
        FROM recipeBookRecipes
        JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
        LEFT JOIN users ON recipes.user_id = users.id
        WHERE recipeBookRecipes.book_id = ${id}
        ${searchQuery ? sql`AND (
            recipes.title ILIKE ${`%${searchQuery}%`} OR
            recipes.category ILIKE ${`%${searchQuery}%`} OR
            COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
            recipes.duration::text ILIKE ${`%${searchQuery}%`}
        )` : sql``}`
        return recipes || null
    } catch (error) {
        console.error(`Database error: ${error}`)
        return null
    }
}

export async function fetchRecentlyViewedRecipes() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const recentlyViewedRecipes = await sql<Recipe[]>`
            SELECT DISTINCT ON (recipes.id) 
                recipes.id, 
                recipes.title, 
                recipes.description, 
                recipes.image_url, 
                recipes.is_public,
                recipes.category,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username,
                "recipeLogs".opened_at
            FROM "recipeLogs"
            JOIN recipes ON "recipeLogs".recipe_id = recipes.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE "recipeLogs".user_id = ${user.id}
            ORDER BY recipes.id, "recipeLogs".opened_at DESC
            LIMIT 4
        `;
        return recentlyViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchMostViewedRecipes() {
    try {
        const mostViewedRecipes = await sql<Recipe[]>`
            SELECT DISTINCT ON (recipes.id) 
                recipes.id, 
                recipes.title, 
                recipes.description, 
                recipes.image_url, 
                recipes.is_public,
                recipes.category,
                recipes.duration,
                COALESCE(users.username, 'Unknown') as username,
                COUNT("recipeLogs".recipe_id) as view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN "recipeLogs" ON recipes.id = "recipeLogs".recipe_id
            GROUP BY recipes.id, recipes.title, recipes.description, recipes.image_url, 
                     recipes.is_public, recipes.category, recipes.duration, users.username
            ORDER BY recipes.id, view_count DESC
            LIMIT 4
        `;
        return mostViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}
