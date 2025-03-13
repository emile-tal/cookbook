import { Book, LiteRecipe, Recipe } from './definitions'

import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchUserBooks(id: string) {
    try {
        const userBooks = await sql<Book[]>`
        SELECT recipeBooks.id, recipeBooks.name, recipeBooks.image_url, users.username
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        WHERE recipeBooks.user_id = ${id}`
        return userBooks || null
    } catch (error) {
        console.error(`Database error: ${error}`)
        return null
    }
}

export async function fetchBookByBookId(id: string) {
    try {
        const book = await sql<Book[]>`
        SELECT 
          recipeBooks.id, 
          recipeBooks.name, 
          recipeBooks.image_url,
          users.username
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        WHERE recipeBooks.id = ${id}
      `;
        return book[0] || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchRecipesByBookId(id: string) {
    try {
        const recipes = await sql<LiteRecipe[]>`
        SELECT recipes.id, recipes.title, recipes.image_url, users.username, recipes.category, recipes.duration
        FROM recipeBookRecipes
        JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
        JOIN users ON recipes.user_id = users.id
        WHERE recipeBookRecipes.book_id = ${id}`
        return recipes || null
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
                users.username
            FROM recipes
            JOIN users ON recipes.user_id = users.id
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