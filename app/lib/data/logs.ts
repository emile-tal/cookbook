'use server'

import { getCurrentUser } from "../auth";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

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