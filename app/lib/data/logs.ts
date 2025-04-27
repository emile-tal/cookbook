'use server'

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
