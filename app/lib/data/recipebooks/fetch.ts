'use server'

import { Book } from '../../../types/definitions'
import { getCurrentUser } from '../../auth';
import sql from '../../db';

export async function fetchUserBooks(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const userBooks = await sql<Book[]>`
            SELECT 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                recipeBooks.is_public, 
                users.username,
                COUNT(recipeBookRecipes.recipe_id) as recipe_count
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
            WHERE recipeBooks.user_id = ${user.id}
            ${searchQuery ? sql`AND (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
            GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
        `;
        return userBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

// Fetches a book by id - checks if the book is public or the user is the owner or has permission to view
export async function fetchBookByBookId(id: string) {
    const user = await getCurrentUser();
    try {
        const book = await sql<Book[]>`
        SELECT 
          recipeBooks.id, 
          recipeBooks.name, 
          recipeBooks.image_url,
          recipeBooks.is_public,
          users.username,
          COUNT(recipeBookRecipes.recipe_id) as recipe_count
        FROM recipeBooks
        JOIN users ON recipeBooks.user_id = users.id
        LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
        WHERE recipeBooks.id = ${id} AND recipeBooks.is_public = true ${user ? sql`OR recipeBooks.user_id = ${user.id} OR recipeBooks.id IN (
            SELECT book_id FROM permissions WHERE user_id = ${user.id}
        )` : sql``}
        GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
      `;
        return book[0] || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

// Fetches recently viewed (by the user) books - checks if the book is public or the user is the owner or has permission to view
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
                COUNT(recipeBookRecipes.recipe_id) as recipe_count,
                recipebooklogs.opened_at
            FROM recipebooklogs
            JOIN recipeBooks ON recipebooklogs.book_id = recipeBooks.id
            JOIN users ON recipeBooks.user_id = users.id
            LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
            WHERE recipebooklogs.user_id = ${user.id} AND (recipeBooks.user_id = ${user.id} OR recipeBooks.is_public = true OR recipeBooks.id IN (
                SELECT book_id FROM permissions WHERE user_id = ${user.id}
            ))
            GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, users.username, recipebooklogs.opened_at
            ORDER BY recipeBooks.id, recipebooklogs.opened_at DESC
            LIMIT 4
        `;
        return recentlyViewedBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

// Fetches most viewed (by all users) public books
export async function fetchMostViewedBooks() {
    try {
        const mostViewedBooks = await sql<Book[]>`
            SELECT DISTINCT ON (recipeBooks.id) 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                users.username,
                COUNT(recipeBookRecipes.recipe_id) as recipe_count,
                COUNT(recipebooklogs.book_id) as view_count
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            LEFT JOIN recipebooklogs ON recipeBooks.id = recipebooklogs.book_id
            LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
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

// Fetches saved books - checks if the book is public or the user is the owner or has permission to view
export async function fetchSavedBooks(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const savedBooks = await sql<Book[]>`
            SELECT 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                recipeBooks.is_public, 
                users.username,
                COUNT(recipeBookRecipes.recipe_id) as recipe_count
            FROM recipeBooks
            JOIN savedrecipebooks ON recipeBooks.id = savedrecipebooks.book_id
            JOIN users ON recipeBooks.user_id = users.id
            LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
            WHERE savedrecipebooks.user_id = ${user.id} AND (recipeBooks.is_public = true OR recipeBooks.user_id = ${user.id} OR recipeBooks.id IN (
                SELECT book_id FROM permissions WHERE user_id = ${user.id}
            ))
            ${searchQuery ? sql`AND (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
            GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
        `;
        return savedBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}

// Fetches all books by query - checks if the book is public or the user is the owner or has permission to view
export async function fetchAllBooksByQuery(searchQuery?: string) {
    const user = await getCurrentUser();
    try {
        const books = await sql<Book[]>`
            SELECT 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                recipeBooks.is_public, 
                users.username,
                COUNT(recipeBookRecipes.recipe_id) as recipe_count
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
            WHERE recipeBooks.is_public = true ${user ? sql`OR recipeBooks.user_id = ${user.id} OR recipeBooks.id IN (
                SELECT book_id FROM permissions WHERE user_id = ${user.id}
            )` : sql``}
            ${searchQuery ? sql`AND (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
            GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
        `;
        return books || [];
    } catch (error) {
        console.error(`Database error: ${error}`);
        return [];
    }
}

export async function fetchBookIdsByRecipeId(recipeId: string) {
    try {
        const bookIds = await sql<{ book_id: string }[]>`
            SELECT book_id
            FROM recipeBookRecipes
            WHERE recipe_id = ${recipeId}
        `;
        return bookIds || [];
    } catch (error) {
        console.error(`Database error: ${error}`);
        return [];
    }
}

export async function fetchSharedBooksByQuery(searchQuery?: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        const sharedBooks = await sql<Book[]>`
            SELECT 
                recipeBooks.id, 
                recipeBooks.name, 
                recipeBooks.image_url, 
                recipeBooks.is_public, 
                users.username,
                COUNT(recipeBookRecipes.recipe_id) as recipe_count
            FROM recipeBooks
            JOIN users ON recipeBooks.user_id = users.id
            JOIN permissions ON recipeBooks.id = permissions.book_id
            LEFT JOIN recipeBookRecipes ON recipeBooks.id = recipeBookRecipes.book_id
            WHERE permissions.user_id = ${user.id}
            ${searchQuery ? sql`AND (
                recipeBooks.name ILIKE ${`%${searchQuery}%`} OR
                users.username ILIKE ${`%${searchQuery}%`}
            )` : sql``}
            GROUP BY recipeBooks.id, recipeBooks.name, recipeBooks.image_url, recipeBooks.is_public, users.username
        `;
        return sharedBooks || null;
    } catch (error) {
        console.error(`Database error: ${error}`);
        return null;
    }
}
