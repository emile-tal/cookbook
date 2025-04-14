'use server'

import { LiteRecipe, Recipe } from '../../../types/definitions'

import { getCurrentUser } from '../../auth';
import sql from '../../db';

// Fetches a full recipe by id - checks if the recipe is public or the user is the owner
export async function fetchRecipeById(id: string) {
    const user = await getCurrentUser();
    try {
        const recipe = await sql<Recipe[]>`
        WITH recipe_base AS (
            SELECT 
                recipes.id, 
                recipes.title,  
                recipes.image_url, 
                recipes.is_public,
                recipes.duration,
                recipes.recipe_yield,
                COALESCE(users.username, 'Unknown') as username
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = ${id} ${user ? sql`AND (recipes.user_id = ${user.id} OR recipes.is_public = true)` : sql`recipes.is_public = true`}
        ),
        recipe_ingredients AS (
            SELECT 
                recipe_id,
                json_agg(json_build_object(
                    'position', position,
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
        ),
        average_rating AS (
            SELECT 
                recipe_id,
                json_build_object(
                    'average_rating', avg(rating),
                    'num_ratings', count(rating)
                ) as average_rating
            FROM ratings
            WHERE recipe_id = ${id}
            GROUP BY recipe_id
        )
        SELECT 
            rb.*,
            COALESCE(ri.ingredients, '[]'::json) as ingredients,
            COALESCE(rins.instructions, '[]'::json) as instructions,
            COALESCE(rc.categories, ARRAY[]::text[]) as categories,
            COALESCE(ar.average_rating, '{"average_rating": 0, "num_ratings": 0}'::json) as average_rating
        FROM recipe_base rb
        LEFT JOIN recipe_ingredients ri ON rb.id = ri.recipe_id
        LEFT JOIN recipe_instructions rins ON rb.id = rins.recipe_id
        LEFT JOIN recipe_categories rc ON rb.id = rc.recipe_id
        LEFT JOIN average_rating ar ON rb.id = ar.recipe_id`;
        return recipe[0] || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

// Fetches recipes by book id - checks if the book is public or the user is the owner
export async function fetchRecipesByBookId(id: string) {
    const user = await getCurrentUser();
    try {
        const recipes = await sql<LiteRecipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            )
            SELECT DISTINCT
                recipes.id, 
                recipes.title, 
                recipes.image_url,
                COALESCE(users.username, 'Unknown') as username, 
                recipes.duration,
                recipes.recipe_yield,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories
            FROM recipeBookRecipes
            JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
            JOIN recipebooks ON recipeBookRecipes.book_id = recipebooks.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipeBookRecipes.book_id = ${id} 
            ${user ?
                sql`AND (recipebooks.user_id = ${user.id} OR recipebooks.is_public = true) OR recipebooks.id IN (
                SELECT book_id FROM permissions WHERE user_id = ${user.id}
            )` : sql`AND recipebooks.is_public = true`}
        `;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

// Fetches recipes by book id and query (for when opening a book) - checks if the book is public or the user is the owner or has permission to view
export async function fetchRecipesByBookIdAndQuery(id: string, searchQuery?: string) {
    const user = await getCurrentUser();
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
                recipes.recipe_yield,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories
            FROM recipeBookRecipes
            JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
            JOIN recipebooks ON recipeBookRecipes.book_id = recipebooks.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipeBookRecipes.book_id = ${id} AND recipebooks.is_public = true ${user ? sql`OR recipebooks.user_id = ${user.id} OR recipebooks.id IN (
                SELECT book_id FROM permissions WHERE user_id = ${user.id}
            )` : sql``}
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

// Fetches recently viewed (by the user) recipes - checks if the recipe is public or the user is the owner
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
                recipes.recipe_yield,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                recipelogs.opened_at
            FROM recipelogs
            JOIN recipes ON recipelogs.recipe_id = recipes.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipelogs.user_id = ${user.id} AND (recipes.user_id = ${user.id} OR recipes.is_public = true)
            ORDER BY recipes.id, recipelogs.opened_at DESC
            LIMIT 4
        `;
        return recentlyViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}


// Fetches most viewed (by all users) public recipes
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
                recipes.recipe_yield,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                COUNT(recipelogs.recipe_id) as view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipelogs ON recipes.id = recipelogs.recipe_id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipes.is_public = true
            GROUP BY recipes.id, recipes.title, recipes.description, recipes.image_url,
                recipes.is_public, recipes.duration, recipes.recipe_yield, users.username, rc.categories
            ORDER BY recipes.id, view_count DESC
            LIMIT 4
        `;
        return mostViewedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

// Fetches most viewed (by the user) recipes - checks if the recipe is public or the user is the owner
export async function fetchMostViewedRecipesByUser() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const mostViewedRecipesByUser = await sql<Recipe[]>`
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
                recipes.recipe_yield,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                COUNT(recipelogs.recipe_id) as view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipelogs ON recipes.id = recipelogs.recipe_id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipelogs.user_id = ${user.id} AND (recipes.user_id = ${user.id} OR recipes.is_public = true)
            GROUP BY recipes.id, recipes.title, recipes.description, recipes.image_url,
                recipes.is_public, recipes.duration, recipes.recipe_yield, users.username, rc.categories
            ORDER BY recipes.id, view_count DESC
            LIMIT 4
        `;
        return mostViewedRecipesByUser || null;
    } catch (error) {
        console.error(`Database error: ${error} `);
        return null;
    }
}

// Fetches all recipes by query - checks if the recipe is public or the user is the owner
export async function fetchAllRecipesByQuery(searchQuery?: string) {
    const user = await getCurrentUser();
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
                recipes.recipe_yield,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE (recipes.is_public = true ${user ? sql`OR recipes.user_id = ${user.id}` : sql``})
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
            )` : sql``}
        `;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}