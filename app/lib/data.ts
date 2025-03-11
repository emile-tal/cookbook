import { Book } from './definitions'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchUserBooks(id: string) {
    try {
        const userBooks = await sql<Book[]>`
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
        const book = await sql<Book[]>`
        SELECT recipeBooks.id, recipeBooks.name, users.username
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        WHERE recipeBooks.id = ${id}`
        return book
    } catch (error) {
        console.error(`Database error: ${error}`)
    }
}