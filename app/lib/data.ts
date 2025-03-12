import { Book, LiteRecipe, Recipe } from './definitions'

import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchUserBooks(id: string) {
    try {
        const userBooks = await sql<Book[]>`
        SELECT recipeBooks.id, recipeBooks.name, users.username
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
        SELECT recipes.id, recipes.title, recipes.image_url, users.username
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


export async function fetchRecipe(id: string) {
    try {
        const recipe = await sql<Recipe[]>`
        SELECT recipes.id, recipes.title, recipes.description, recipes.image_url, recipes.is_public
        FROM recipes
        WHERE recipes.id = ${id}`
        return recipe[0] || null
    } catch (error) {
        console.error(`Database error: ${error}`)
        return null
    }
}