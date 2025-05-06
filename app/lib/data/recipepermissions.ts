'use server'

import { getCurrentUser } from "../auth"
import sql from '../db'

export async function addUserToRecipePermissions(invitationId: string, recipeId: string, canEdit: boolean, userId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`INSERT INTO recipepermissions (recipe_id, user_id, can_edit) VALUES (${recipeId}, ${userId}, ${canEdit})`
        await sql`UPDATE invitations SET status = true WHERE id = ${invitationId}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to add user to permissions')
    }
}

export async function userCanEditRecipe(recipeId: string, userId: string) {
    try {
        const result = await sql`
            SELECT 
                CASE 
                    WHEN recipes.user_id = ${userId} THEN true
                    WHEN recipepermissions.can_edit = true THEN true
                    ELSE false
                END as can_add
            FROM recipes
            LEFT JOIN recipepermissions ON recipes.id = recipepermissions.recipe_id AND recipepermissions.user_id = ${userId}
            WHERE recipes.id = ${recipeId}
        `;
        return result[0]?.can_add || false;
    } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
}