'use server'

import { Book } from '../../types/definitions'
import { getCurrentUser } from '../auth';
import sql from '../db';

export async function fetchUserBooks(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const userBooks = await sql<Book[]>`
            SELECT recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
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
          recipeBooks.is_public,
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

//TODO: Need to optimize this function
export async function fetchRecipeCountForAllBooks() {
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
            WHERE recipeBooks.is_public = true
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

export async function fetchSavedBooks(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const savedBooks = await sql<Book[]>`
            SELECT recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
            FROM recipeBooks
            JOIN savedrecipebooks ON recipeBooks.id = savedrecipebooks.book_id
            JOIN users ON recipeBooks.user_id = users.id
            WHERE savedrecipebooks.user_id = ${user.id}
            ${searchQuery ? sql`AND (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
        `;
        return savedBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

export async function addSavedBook(bookId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO savedrecipebooks (user_id, book_id) VALUES (${user.id}, ${bookId})`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function removeSavedBook(bookId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`DELETE FROM savedrecipebooks WHERE user_id = ${user.id} AND book_id = ${bookId}`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function createBook(name: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO recipeBooks (user_id, name, is_public) VALUES (${user.id}, ${name}, false)`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function createBookWithRecipe(name: string, recipeId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const [book] = await sql<Book[]>`
            INSERT INTO recipeBooks (user_id, name, is_public) 
            VALUES (${user.id}, ${name}, false)
            RETURNING id, name, image_url, user_id, is_public
        `;

        if (book) {
            await sql`INSERT INTO recipeBookRecipes (book_id, recipe_id) VALUES (${book.id}, ${recipeId})`;
            return { success: true, book };
        }
        return { success: false };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function deleteBook(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`DELETE FROM recipeBooks WHERE id = ${id} AND user_id = ${user.id}`;
        return { success: true };
    } catch (error) {
        console.error(`Database error: ${error}`);
        return { success: false };
    }
}

export async function fetchAllPublicBooksByQuery(searchQuery?: string) {
    try {
        const books = await sql<Book[]>`
            SELECT recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            WHERE recipeBooks.is_public = true
            ${searchQuery ? sql`AND (
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