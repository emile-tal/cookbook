import { Book, LiteBook, Recipe } from './definitions'

import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchUserBooks(id: string) {
    try {
        const userBooks = await sql<LiteBook[]>`
        SELECT recipeBooks.id, recipeBooks.name, users.username
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        WHERE recipeBooks.user_id = ${id}`
        return userBooks
    } catch (error) {
        console.error(`Database error: ${error}`)
    }
}

export async function fetchBook(id: string) {
    try {
        const book = await sql`
        SELECT 
          recipeBooks.id, 
          recipeBooks.name, 
          users.username,
          COALESCE(
            json_agg(
              json_build_object(
                'id', recipes.id,
                'title', recipes.title,
                'image_url', recipes.image_url
              )
            ) FILTER (WHERE recipes.id IS NOT NULL),
            '[]'
          ) AS recipes
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
        LEFT JOIN recipes ON recipeBookRecipes.recipe_id = recipes.id
        WHERE recipeBooks.id = ${id}
        GROUP BY recipeBooks.id, recipeBooks.name, users.username
      `;

        return book || null; // Ensure we return a single book or null if not found
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}


export async function fetchRecipe(id: string) {
    try {
        const recipe = await sql<Recipe[]>`
        SELECT recipes.id, recipes.title, recipes.description, recipes.image_url, recipes.is_public
        FROM recipes
        WHERE recipes.id = ${id}`
        return recipe
    } catch (error) {
        console.error(`Database error: ${error}`)
    }
}