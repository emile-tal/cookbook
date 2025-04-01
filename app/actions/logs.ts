'use server'

import { createLogByBookId } from "../lib/data/logs";
import { createLogByRecipeId } from "../lib/data/logs";

export async function logBookView(bookId: string) {
    await createLogByBookId(bookId);
}

export async function logRecipeView(recipeId: string) {
    await createLogByRecipeId(recipeId);
}
