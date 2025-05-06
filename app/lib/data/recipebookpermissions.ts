'use server'

import { getCurrentUser } from "../auth"
import sql from '../db'

export async function addUserToBookPermissions(invitationId: string, bookId: string, canEdit: boolean, userId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`INSERT INTO recipebookpermissions (book_id, user_id, can_edit) VALUES (${bookId}, ${userId}, ${canEdit})`
        await sql`UPDATE invitations SET status = true WHERE id = ${invitationId}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to add user to permissions')
    }
}

export async function userCanEditBook(bookId: string, userId: string) {
    try {
        const result = await sql`
            SELECT 
                CASE 
                    WHEN recipeBooks.user_id = ${userId} THEN true
                    WHEN recipebookpermissions.can_edit = true THEN true
                    ELSE false
                END as can_add
            FROM recipeBooks
            LEFT JOIN recipebookpermissions ON recipeBooks.id = recipebookpermissions.book_id AND recipebookpermissions.user_id = ${userId}
            WHERE recipeBooks.id = ${bookId}
        `;
        return result[0]?.can_add || false;
    } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
}