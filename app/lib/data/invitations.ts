'use server'

import { Invitation } from "@/app/types/definitions"
import { fetchBookByBookId } from "./recipebooks/recipebook"
import { getCurrentUser } from "../auth"
import sql from '../db'

export async function sendInvitation(bookId: string, email: string, message: string, permission: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }

    const book = await fetchBookByBookId(bookId)
    if (!book) {
        throw new Error('Book not found')
    }
    const canEdit = permission === 'editor'
    try {
        await sql`INSERT INTO invitations (book_id, sender_id, recipient_email, message, can_edit) VALUES (${bookId}, ${user.id}, ${email}, ${message}, ${canEdit})`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to invite collaborator')
    }
}

export async function fetchUnreadInvitationsCountByUser() {
    const user = await getCurrentUser()
    if (!user) {
        return 0
    }
    try {
        const result = await sql`SELECT COUNT(*) FROM invitations WHERE recipient_email = ${user.email} AND status = 'false'`
        return Number(result[0].count) || 0
    } catch (error) {
        console.error(error)
        return 0
    }
}

export async function fetchPendingInvitationsByUser() {
    const user = await getCurrentUser()
    if (!user) {
        return null
    }
    try {
        const invitations = await sql<Invitation[]>`
            SELECT 
                invitations.id,
                invitations.book_id,
                recipeBooks.name as book_name,
                recipeBooks.image_url as book_image_url,
                users.username as sender_username,
                invitations.recipient_email,
                invitations.message,
                invitations.can_edit,
                invitations.created_at
            FROM invitations
            JOIN recipeBooks ON invitations.book_id = recipeBooks.id
            JOIN users ON invitations.sender_id = users.id
            WHERE invitations.recipient_email = ${user.email} AND invitations.status = 'false'
        `
        return invitations
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function rejectInvitation(invitationId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`UPDATE invitations SET status = false WHERE id = ${invitationId}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to reject invitation')
    }
}