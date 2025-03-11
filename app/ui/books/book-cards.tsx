'use client'

import { Book } from "@/app/lib/definitions";
import { useRouter } from 'next/navigation';

interface Props {
    books: Book[]
}

export function BookCards({ books }: Props) {
    const router = useRouter();

    return (
        books.map((book) => (
            <div key={book.id} onClick={() => router.push(`/books/${book.id}`)}>
                <span>{book.name}</span>
            </div>
        ))
    )
}