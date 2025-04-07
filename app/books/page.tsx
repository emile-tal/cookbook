import { fetchRecipeCountForAllBooks, fetchSavedBooks, fetchUserBooks } from "@/app/lib/data/recipeBook"

import { BookDisplay } from "@/app/ui/books/book-display"

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const myBooks = await fetchUserBooks(q)
    const recipeCountByBook = await fetchRecipeCountForAllBooks()
    const savedBooks = await fetchSavedBooks(q)

    return (
        <main className="py-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Books</h2>
                {myBooks ? (
                    <BookDisplay books={myBooks} recipeCountByBook={recipeCountByBook} savedBooks={savedBooks?.map(book => book.id) || []} />
                ) : (
                    <p className="text-gray-500">No books found</p>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Saved Books</h2>
                {savedBooks ? (
                    <BookDisplay books={savedBooks} recipeCountByBook={recipeCountByBook} savedBooks={savedBooks.map(book => book.id)} />
                ) : (
                    <p className="text-gray-500">No saved books yet</p>
                )}
            </div>
        </main>
    )
}