'use server'

import { getCurrentUser } from "../auth"
import sql from '../db'

export async function addUserToPermissions(invitationId: string, bookId: string, canEdit: boolean, userId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`INSERT INTO permissions (book_id, user_id, can_edit) VALUES (${bookId}, ${userId}, ${canEdit})`
        await sql`UPDATE invitations SET status = true WHERE id = ${invitationId}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to add user to permissions')
    }
}