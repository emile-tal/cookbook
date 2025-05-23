'use server'

import { LiteRecipe, Recipe } from '../../../types/definitions'

import { getCurrentUser } from '../../auth';
import sql from '../../db';

// Fetches a full recipe by id - checks if the recipe is public or the user is the owner
export async function fetchRecipeById(id: string) {
    const user = await getCurrentUser();
    try {
        if (user) {
            const claims = JSON.stringify({ sub: user.id });
            await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
        }

        const recipe = await sql<Recipe[]>`
        WITH recipe_base AS (
            SELECT 
                recipes.id, 
                recipes.title,  
                recipes.image_url, 
                recipes.is_public,
                recipes.duration,
                recipes.recipe_yield,
                recipes.description,
                COALESCE(users.username, 'Unknown') as username
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = ${id} ${user ? sql`AND (
                recipes.user_id = ${user.id} 
                OR recipes.is_public = true 
                OR recipes.id IN (
                    SELECT recipe_id FROM recipepermissions WHERE recipe_id = ${id}
                )
            )` : sql`AND recipes.is_public = true`}
        ),
        recipe_ingredients AS (
            SELECT 
                recipe_id,
                json_agg(json_build_object(
                    'id', id,
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
                    'id', id,
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
export async function fetchRecipesByBookId(bookId: string) {
    const user = await getCurrentUser();
    try {
        if (user) {
            const claims = JSON.stringify({ sub: user.id });
            await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
        }

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
            WHERE recipeBookRecipes.book_id = ${bookId} AND (
                recipes.is_public = true 
                ${user ? sql`OR recipes.user_id = ${user.id} OR recipes.id IN (
                    SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
                )` : sql``}
            )`;
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
        if (user) {
            const claims = JSON.stringify({ sub: user.id });
            await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
        }

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
            WHERE recipeBookRecipes.book_id = ${id} AND (
                recipes.is_public = true 
                ${user ? sql`OR recipes.user_id = ${user.id} OR recipes.id IN (
                    SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
                )` : sql``}
            )
            ${searchQuery ? sql`AND (
                recipes.title ILIKE ${`%${searchQuery}%`} OR
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;

        const recentlyViewedRecipes = await sql<Recipe[]>`
            WITH recipe_categories AS (
                SELECT 
                    recipe_id,
                    array_agg(category) as categories
                FROM recipecategories
                GROUP BY recipe_id
            ),
            recent_views AS (
                SELECT
                    recipe_id,
                    MAX(opened_at) as last_opened
                FROM recipelogs
                WHERE user_id = ${user.id}
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
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                rv.last_opened
            FROM recent_views rv
            JOIN recipes ON rv.recipe_id = recipes.id
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipes.is_public = true OR recipes.user_id = ${user.id} OR recipes.id IN (
                SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
            )
            ORDER BY rv.last_opened DESC
                LIMIT 4;
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
            SELECT 
                recipes.id,
                recipes.title,
                recipes.description,
                recipes.image_url,
                recipes.is_public,
                recipes.duration,
                recipes.recipe_yield,
                COALESCE(users.username, 'Unknown') as username,
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                COUNT(recipelogs.id) AS view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipelogs ON recipes.id = recipelogs.recipe_id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipes.is_public = true
            GROUP BY recipes.id, users.username, rc.categories
            ORDER BY view_count DESC
            LIMIT 4;
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
        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;

        const mostViewedRecipesByUser = await sql<Recipe[]>`
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
                COALESCE(rc.categories, ARRAY[]::text[]) as categories,
                COUNT(recipelogs.id) AS view_count
            FROM recipes
            LEFT JOIN users ON recipes.user_id = users.id
            LEFT JOIN recipelogs ON recipes.id = recipelogs.recipe_id
            LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
            WHERE recipelogs.user_id = ${user.id} 
            AND (recipes.user_id = ${user.id} OR recipes.is_public = true OR recipes.id IN (
                SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
            ))
            GROUP BY recipes.id, users.username, rc.categories
            ORDER BY view_count DESC
            LIMIT 4;
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
        if (user) {
            const claims = JSON.stringify({ sub: user.id });
            await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;
        }

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
            WHERE (recipes.is_public = true ${user ? sql`OR recipes.user_id = ${user.id} OR recipes.id IN (
                SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
            )` : sql``})
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

// Fetches all public recipes by user id
export async function fetchAllPublicRecipesByUserId(userId: string, searchQuery?: string) {
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
        FROM recipes
        LEFT JOIN users ON recipes.user_id = users.id
        LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
        WHERE recipes.user_id = ${userId} AND (recipes.is_public = true ${user ? sql`OR recipes.user_id = ${user.id} OR recipes.id IN (
            SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
        )` : sql``})
        ${searchQuery ? sql`AND (
            recipes.title ILIKE ${`%${searchQuery}%`} OR
            recipes.description ILIKE ${`%${searchQuery}%`} OR
            COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
            recipes.duration::text ILIKE ${`%${searchQuery}%`}
        )` : sql``}
        ORDER BY recipes.title ASC`;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchSavedRecipesByQuery(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
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
        FROM recipes
        LEFT JOIN users ON recipes.user_id = users.id
        LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
        WHERE recipes.id IN (
                SELECT recipe_id FROM savedrecipes WHERE user_id = ${user.id}
            )
        ${searchQuery ? sql`AND (
            recipes.title ILIKE ${`%${searchQuery}%`} OR
            recipes.description ILIKE ${`%${searchQuery}%`} OR
            COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
                recipes.duration::text ILIKE ${`%${searchQuery}%`}
            )` : sql``}
        `;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchSharedRecipesByQuery(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
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
        FROM recipes
        LEFT JOIN users ON recipes.user_id = users.id
        LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
        WHERE recipes.id IN (
                SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id}
            )
        ${searchQuery ? sql`AND (
            recipes.title ILIKE ${`%${searchQuery}%`} OR
            recipes.description ILIKE ${`%${searchQuery}%`} OR
            COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
                recipes.duration::text ILIKE ${`%${searchQuery}%`}
            )` : sql``}
        `;
        return recipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchUserRecipesByQuery(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const ownedRecipes = await sql<LiteRecipe[]>`
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
        FROM recipes
        LEFT JOIN users ON recipes.user_id = users.id
        LEFT JOIN recipe_categories rc ON recipes.id = rc.recipe_id
        WHERE recipes.user_id = ${user.id}
        ${searchQuery ? sql`AND (
            recipes.title ILIKE ${`%${searchQuery}%`} OR
            recipes.description ILIKE ${`%${searchQuery}%`} OR
            COALESCE(users.username, 'Unknown') ILIKE ${`%${searchQuery}%`} OR
                recipes.duration::text ILIKE ${`%${searchQuery}%`}
            )` : sql``}
        `;
        return ownedRecipes || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchEditableRecipes() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const recipes = await sql`
        SELECT id FROM recipes WHERE user_id = ${user.id} OR id IN (
            SELECT recipe_id FROM recipepermissions WHERE user_id = ${user.id} AND can_edit = true
        )
        `;
        return recipes.map(recipe => recipe.id) || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}
