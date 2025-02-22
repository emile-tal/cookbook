import { Book } from "@/app/lib/definitions";

export function BookCards(books: Book[]) {
    return (
        books.map((book) => (
            <div key={book.id}>
                <span>{book.name}</span>
            </div>
        ))
    )
}