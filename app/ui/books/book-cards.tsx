'use client'

import { LiteBook } from "@/app/lib/definitions";
import { useRouter } from 'next/navigation';
import { useView } from "@/app/context/view-context";

interface Props {
    books: LiteBook[]
}

export function BookCards({ books }: Props) {
    const router = useRouter();
    const { view } = useView()

    return (
        books.map((book) => (
            <div key={book.id} onClick={() => router.push(`/books/${book.id}`)} className='flex-wrap h-32 max-w-32 bg-background hover:cursor-pointer'>
                <span>{book.name}</span>
            </div>
        ))
    )
}