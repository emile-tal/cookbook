'use server'

import { Row } from 'postgres';
import { getCurrentUser } from "../auth";
import sql from '../db';
import supabase from "../supabase";

export async function createLogByBookId(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO recipebooklogs (user_id, book_id) VALUES (${user.id}, ${id})`;
    } catch (error) {
        console.error(`Database error: ${error}`);
    }
}

export async function createLogByRecipeId(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    try {
        await sql`INSERT INTO recipelogs (user_id, recipe_id) VALUES (${user.id}, ${id})`;
    } catch (error) {
        console.error(`Database error: ${error}`);
    }
}

export async function logSearch(searchTerm: string) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const { error } = await supabase.functions.invoke('log-search', {
    body: { search_term: searchTerm, user_id: user.id },
  })

  if (error) {
    console.error('Failed to log search:', error)
  }
}

export async function searchAutocomplete(input: string) {
    const user = await getCurrentUser();
    
  if (!input || input.trim().length < 1) {
    return { personalMatches: [], popularMatches: [] }
  }

  const searchInput = `%${input.toLowerCase()}%`

  try {
    let personalMatchesQuery;
    
    if (user) {
        // Fetch personal search history matches
        personalMatchesQuery = await sql`
        SELECT DISTINCT search_term, created_at
        FROM searchlogs
        WHERE user_id = ${user.id}
        AND LOWER(search_term) LIKE ${searchInput}
        ORDER BY created_at DESC
        LIMIT 5
    `
    }
    // Fetch general popular matching searches
    const popularMatchesQuery = await sql`
      SELECT r.title as search_term, COUNT(rl.recipe_id) as count
      FROM recipes r
      LEFT JOIN recipelogs rl ON r.id = rl.recipe_id
      WHERE LOWER(r.title) LIKE ${searchInput}
      GROUP BY r.title
      ORDER BY count DESC
      LIMIT 10
    `

    const personalMatches = personalMatchesQuery ? personalMatchesQuery.map((row: Row) => (row as { search_term: string; created_at: Date }).search_term) : []
    const popularMatches = popularMatchesQuery.map((row: Row) => (row as { search_term: string; count: number }).search_term)

    return { personalMatches, popularMatches }
  } catch (error) {
    console.error('Error fetching autocomplete:', error)
    return { personalMatches: [], popularMatches: [] }
  }
}
