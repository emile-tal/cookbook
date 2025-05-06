'use server'

import { RecipeInvitation } from "@/app/types/definitions"
import { fetchRecipeById } from "./recipes/fetch"
import { getCurrentUser } from "../auth"
import sql from '../db'

export async function sendRecipeInvitation(recipeId: string, email: string, message: string, permission: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }

    const recipe = await fetchRecipeById(recipeId)
    if (!recipe) {
        throw new Error('Recipe not found')
    }
    const canEdit = permission === 'editor'
    try {
        await sql`INSERT INTO recipeinvitations (recipe_id, sender_id, recipient_email, message, can_edit) VALUES (${recipeId}, ${user.id}, ${email}, ${message}, ${canEdit})`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to invite collaborator')
    }
}

export async function fetchUnreadRecipeInvitationsCountByUser() {
    const user = await getCurrentUser()
    if (!user || !user.email) {
        return 0
    }
    try {
        const result = await sql<{ count: string }[]>`SELECT COUNT(*) FROM recipeinvitations WHERE recipient_email = ${user.email} AND status IS NULL`
        return Number(result[0].count) || 0
    } catch (error) {
        console.error(error)
        return 0
    }
}

export async function fetchPendingRecipeInvitationsByUser() {
    const user = await getCurrentUser()
    if (!user || !user.email) {
        return null
    }
    try {
        const invitations = await sql<RecipeInvitation[]>`
            SELECT 
                recipeinvitations.id,
                recipeinvitations.recipe_id,
                recipes.title as recipe_title,
                recipes.image_url as recipe_image_url,
                users.username as sender_username,
                recipeinvitations.recipient_email,
                recipeinvitations.message,
                recipeinvitations.can_edit,
                recipeinvitations.created_at
            FROM recipeinvitations
            JOIN recipes ON recipeinvitations.recipe_id = recipes.id
            JOIN users ON recipeinvitations.sender_id = users.id
            WHERE recipeinvitations.recipient_email = ${user.email} AND recipeinvitations.status IS NULL
        `
        return invitations
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function rejectRecipeInvitation(invitationId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`UPDATE recipeinvitations SET status = false WHERE id = ${invitationId}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to reject invitation')
    }
}