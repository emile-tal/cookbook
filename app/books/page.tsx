import { fetchRecipeCountByBookId, fetchUserBooks } from "../lib/data"

import { BookDisplay } from "../ui/books/book-display"

export default async function Page() {
    // Placeholder user id for now
    const myBooks = await fetchUserBooks('410544b2-4001-4271-9855-fec4b6a6442a')
    const recipeCountByBook = await fetchRecipeCountByBookId()

    if (!myBooks) {
        return <div>No books found</div>
    }

    return (
        <main className="py-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Books</h2>
                <BookDisplay books={myBooks} recipeCountByBook={recipeCountByBook} />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Saved Books</h2>
                <p className="text-gray-500">No saved books yet</p>
            </div>
        </main>
    )
}