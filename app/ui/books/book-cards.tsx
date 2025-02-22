import { Book } from "@/app/lib/definitions";

export function BookCards(books: Book[]) {
    return (
        books.map((book) => (
            <div>
                <span>{book.name}</span>
            </div>
        ))
    )
}