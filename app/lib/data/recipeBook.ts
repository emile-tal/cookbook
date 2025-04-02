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

export async function fetchRecipeCountByBookId() {
    try {
        const recipeCounts = await sql<{ book_id: string, count: number }[]>`
            SELECT book_id, COUNT(recipe_id) as count
            FROM recipeBookRecipes
            GROUP BY book_id
        `;

        // Convert array to a map of book_id -> count
        const countMap: Record<string, number> = {};
        recipeCounts.forEach(item => {
            countMap[item.book_id] = Number(item.count);
        });

        return countMap;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return {};
    }
}

export async function fetchRecentlyViewedBooks() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const recentlyViewedBooks = await sql<Book[]>`
            SELECT DISTINCT ON (recipeBooks.id) 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                users.username,
                recipebooklogs.opened_at
            FROM recipebooklogs
            JOIN recipeBooks ON recipebooklogs.book_id = recipeBooks.id
            JOIN users ON recipebooklogs.user_id = users.id
            WHERE recipebooklogs.user_id = ${user.id}
            ORDER BY recipeBooks.id, recipebooklogs.opened_at DESC
            LIMIT 4
        `;
        return recentlyViewedBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function fetchMostViewedBooks() {
    try {
        const mostViewedBooks = await sql<Book[]>`
            SELECT DISTINCT ON (recipeBooks.id) 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                users.username,
                COUNT(recipebooklogs.book_id) as view_count
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            LEFT JOIN recipebooklogs ON recipeBooks.id = recipebooklogs.book_id
            GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, users.username
            ORDER BY recipeBooks.id, view_count DESC
            LIMIT 4
        `;
        return mostViewedBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}


