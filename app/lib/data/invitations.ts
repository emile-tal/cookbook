'use server'

import { Invitation } from "@/app/types/definitions"
import { fetchBookByBookId } from "./recipeBook"
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

export async function fetchUnreadInvitationsByUser() {
    const user = await getCurrentUser()
    if (!user) {
        return null
    }
    try {
        const invitations = await sql<Invitation[]>`SELECT * FROM invitations WHERE recipient_email = ${user.email} AND status = 'false'`
        return invitations
    } catch (error) {
        console.error(error)
        return null
    }
}
