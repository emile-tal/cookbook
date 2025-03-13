'use client'

import { Book } from "@/app/lib/definitions";
import Image from "next/image";
import { useRouter } from 'next/navigation';
interface Props {
    books: Book[]
}

export function BookCards({ books }: Props) {
    const router = useRouter();

    return (
        books.map((book) => (
            <div key={book.id} onClick={() => router.push(`/books/${book.id}`)} className='flex-wrap h-32 max-w-32 bg-background hover:cursor-pointer'>
                <span>{book.name}</span>
                <Image src={book.image_url} alt={book.name} width={100} height={100} />
            </div>
        ))
    )
}