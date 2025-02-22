import { BookCards } from "../ui/books/book-cards"
import { fetchUserBooks } from "../lib/data"

export default async function Page() {

    // Placeholder user id for now
    const myBooks = await fetchUserBooks('410544b2-4001-4271-9855-fec4b6a6442a')

    return (
        <main>
            <div>
                <h2>My Books</h2>
                {/* {myBooks && <BookCards books={myBooks} />} */}
            </div>
            <div>
                <h2>Saved Books</h2>
            </div>
        </main>
    )
}