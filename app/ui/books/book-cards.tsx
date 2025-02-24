import { Book } from "@/app/lib/definitions";

interface Props {
    books: Book[]
}

export function BookCards({ books }: Props) {
    return (
        books.map((book) => (
            <div key={book.id}>
                <span>{book.name}</span>
            </div>
        ))
    )
}