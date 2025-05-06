'use server'

import { BookInvitation } from "@/app/types/definitions"
import { fetchBookByBookId } from "./recipebooks/fetch"
import { getCurrentUser } from "../auth"
import sql from '../db'

export async function sendBookInvitation(bookId: string, email: string, message: string, permission: string) {
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
        await sql`INSERT INTO recipebookinvitations (book_id, sender_id, recipient_email, message, can_edit) VALUES (${bookId}, ${user.id}, ${email}, ${message}, ${canEdit})`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to invite collaborator')
    }
}

export async function fetchUnreadBookInvitationsCountByUser() {
    const user = await getCurrentUser()
    if (!user || !user.email) {
        return 0
    }
    try {
        const result = await sql<{ count: string }[]>`SELECT COUNT(*) FROM recipebookinvitations WHERE recipient_email = ${user.email} AND status IS NULL`
        return Number(result[0].count) || 0
    } catch (error) {
        console.error(error)
        return 0
    }
}

export async function fetchPendingBookInvitationsByUser() {
    const user = await getCurrentUser()
    if (!user || !user.email) {
        return null
    }
    try {
        const invitations = await sql<BookInvitation[]>`
            SELECT 
                recipebookinvitations.id,
                recipebookinvitations.book_id,
                recipeBooks.name as book_name,
                recipeBooks.image_url as book_image_url,
                users.username as sender_username,
                recipebookinvitations.recipient_email,
                recipebookinvitations.message,
                recipebookinvitations.can_edit,
                recipebookinvitations.created_at
            FROM recipebookinvitations
            JOIN recipeBooks ON recipebookinvitations.book_id = recipeBooks.id
            JOIN users ON recipebookinvitations.sender_id = users.id
            WHERE recipebookinvitations.recipient_email = ${user.email} AND recipebookinvitations.status IS NULL
        `
        return invitations
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function rejectBookInvitation(invitationId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }
    try {
        await sql`UPDATE recipebookinvitations SET status = false WHERE id = ${invitationId}`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to reject invitation')
    }
}