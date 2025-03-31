import { BookDisplay } from "@/app/ui/books/book-display"
import { fetchRecipeCountByBookId } from "../lib/data/recipes";
import { fetchUserBooks } from "@/app/lib/data/recipeBook"

export default async function Page({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    const query = searchParams.q;
    // Placeholder user id for now
    const myBooks = await fetchUserBooks('410544b2-4001-4271-9855-fec4b6a6442a', query)
    const recipeCountByBook = await fetchRecipeCountByBookId()

    return (
        <main className="py-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Books</h2>
                {myBooks ? (
                    <BookDisplay books={myBooks} recipeCountByBook={recipeCountByBook} />
                ) : (
                    <p className="text-gray-500">No books found</p>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Saved Books</h2>
                <p className="text-gray-500">No saved books yet</p>
            </div>
        </main>
    )
}