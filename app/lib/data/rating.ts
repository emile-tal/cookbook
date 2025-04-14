'use server'

import { getCurrentUser } from "../auth"
import sql from "../db"

export async function addRating(recipeId: string, rating: number) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        const existingRating = await fetchUserRating(recipeId)
        if (existingRating.length > 0) {
            await sql`UPDATE ratings SET rating = ${rating} WHERE recipe_id = ${recipeId} AND user_id = ${user.id}`
        } else {
            await sql`INSERT INTO ratings (recipe_id, user_id, rating) VALUES (${recipeId}, ${user.id}, ${rating})`
        }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to add rating')
    }
}

export async function removeRating(recipeId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`DELETE FROM ratings WHERE recipe_id = ${recipeId} AND user_id = ${user.id}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to remove rating')
    }
}

export async function fetchUserRating(recipeId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        const rating = await sql`SELECT rating FROM ratings WHERE recipe_id = ${recipeId} AND user_id = ${user.id}`
        return rating[0] ? rating[0].rating : null
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch user rating')
    }
}