import { BookDisplay } from "../ui/books/book-display"
import { fetchUserBooks } from "../lib/data"
export default async function Page() {

    // Placeholder user id for now
    const myBooks = await fetchUserBooks('410544b2-4001-4271-9855-fec4b6a6442a')

    if (!myBooks) {
        return <div>Book not found</div>;
    }

    return (
        <main>
            <div>
                <h2>My Books</h2>
                <div className="flex flex-wrap gap-4">
                    <BookDisplay books={myBooks} />
                </div>
            </div>
            <div>
                <h2>Saved Books</h2>
            </div>
        </main>
    )
}