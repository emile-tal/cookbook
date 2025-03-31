'use server'

import { Book } from '../../types/definitions'
import { getCurrentUser } from '../auth';
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function fetchAllBooks(searchQuery?: string) {
    try {
        const books = await sql<Book[]>`
            SELECT recipeBooks.id, recipeBooks.name, recipeBooks.image_url, users.username
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            ${searchQuery ? sql`WHERE (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
        `;
        return books || [];
    } catch (error) {
        console.error(`Database error: ${error}`);
        return [];
    }
}

export async function fetchUserBooks(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const userBooks = await sql<Book[]>`
            SELECT recipeBooks.id, recipeBooks.name, recipeBooks.image_url, users.username
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            WHERE recipeBooks.user_id = ${user.id}
            ${searchQuery ? sql`AND (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
        `;
        return userBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
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

