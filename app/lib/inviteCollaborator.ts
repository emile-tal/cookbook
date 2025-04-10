import { fetchBookByBookId } from "./data/recipeBook"
import { getCurrentUser } from "./auth"
import sql from './db'

export async function inviteCollaborator(bookId: string, email: string, message: string, permission: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('User not found')
    }

    const book = await fetchBookByBookId(bookId)
    if (!book) {
        throw new Error('Book not found')
    }
    try {
        await sql`INSERT INTO invitations (book_id, sender_id, recipient_email, message, can_edit) VALUES (${bookId}, ${user.id}, ${email}, ${message}, ${permission === 'editor'})`
    } catch (error) {
        console.error(error)
        throw new Error('Failed to invite collaborator')
    }

}
