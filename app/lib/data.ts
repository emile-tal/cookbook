import { Book } from './definitions'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchUserBooks(id: string) {
    try {
        const userBooks = await sql<Book[]>`
        SELECT recipeBook.id, recipeBook.name, user.username
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        WHERE recipeBooks.user_id = ${id}`
        return userBooks[0]
    } catch (error) {
        console.error(`Database error: ${error}`)
    }
}