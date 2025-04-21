import { fetchSavedBooks, fetchSharedBooksByQuery, fetchUserBooks } from "@/app/lib/data/recipebooks/fetch"

import { BookDisplay } from "@/app/ui/books/book-display"
import NoBooks from "@/app/ui/books/no-books"

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const myBooks = await fetchUserBooks(q)
    const savedBooks = await fetchSavedBooks(q)
    const sharedBooks = await fetchSharedBooksByQuery(q)

    return (
        <main className="py-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Books</h2>
                {myBooks && myBooks.length > 0 ? (
                    <BookDisplay books={myBooks} savedBooks={savedBooks?.map(book => book.id) || []} />
                ) : (
                    <NoBooks message="You haven't created any recipe books yet." />
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Saved Books</h2>
                {savedBooks && savedBooks.length > 0 ? (
                    <BookDisplay books={savedBooks} savedBooks={savedBooks.map(book => book.id)} />
                ) : (
                    <NoBooks message="You haven't saved any books yet." />
                )}
            </div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Shared Books</h2>
                {sharedBooks && sharedBooks.length > 0 ? (
                    <BookDisplay books={sharedBooks} savedBooks={(savedBooks || []).map(book => book.id)} />
                ) : (
                    <NoBooks message="No shared books available yet." />
                )}
            </div>
        </main>

    )
}   