'use client'

import { Book } from '@/app/lib/definitions';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';

interface Props {
    books: Book[];
    recipeCountByBook?: Record<string, number>;
}

export default function BooksList({ books, recipeCountByBook = {} }: Props) {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full">
            {books?.map((book) => (
                <div key={book.id} className='py-3 grid grid-cols-12 w-full border-b border-gray-100 items-center'>
                    <p
                        onClick={() => router.push(`/books/${book.id}`)}
                        className="hover:cursor-pointer col-span-5 font-medium truncate"
                    >
                        {book.name}
                    </p>
                    <p className="col-span-5 truncate">{book.username}</p>
                    <div className="col-span-2 flex justify-end items-center">
                        <span className="mr-3">{recipeCountByBook[book.id] || 0} recipes</span>
                        <EditIcon
                            onClick={() => router.push(`/books/${book.id}`)}
                            className="hover:cursor-pointer text-gray-500 hover:text-gray-700"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
} 