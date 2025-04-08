'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Book } from '@/app/types/definitions';
import EditIcon from '@mui/icons-material/Edit';
import TurnedIn from '@mui/icons-material/TurnedIn';
import TurnedInNot from '@mui/icons-material/TurnedInNot';
import { addSavedBook } from '@/app/lib/data/recipeBook';
import { removeSavedBook } from '@/app/lib/data/recipeBook';
import { useSession } from 'next-auth/react';

interface Props {
    books: Book[];
    recipeCountByBook?: Record<string, number>;
    savedBooks: string[];
}

export default function BooksList({ books, recipeCountByBook = {}, savedBooks = [] }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fullUrl = pathname + '?' + searchParams.toString();

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col w-full">
            {books?.map((book) => (
                <div key={book.id} className='py-3 grid grid-cols-12 w-full border-b border-gray-100 items-center'>
                    <div className="col-span-5 flex items-center gap-2">
                        <p
                            onClick={() => router.push(`/books/${book.id}?from=${fullUrl}`)}
                            className="hover:cursor-pointer font-medium truncate"
                        >
                            {book.name}
                        </p>

                    </div>
                    <p className="col-span-4 truncate">{book.username}</p>
                    <div className="col-span-2 items-center">
                        <span>{recipeCountByBook[book.id] || 0} recipes</span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                        {session?.user?.username === book.username && <EditIcon onClick={() => router.push(`/books/${book.id}/edit?from=${fullUrl}`)} className="hover:cursor-pointer" />}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (savedBooks.includes(book.id)) {
                                    removeSavedBook(book.id);
                                    router.refresh();
                                } else {
                                    addSavedBook(book.id);
                                    router.refresh();
                                }
                            }}
                        >
                            {savedBooks.includes(book.id) ? (
                                <TurnedIn className="text-red-500 text-base hover:cursor-pointer transition-transform duration-200 hover:translate-y-0.5" />
                            ) : (
                                <TurnedInNot className="text-text text-base hover:cursor-pointer transition-transform duration-200 hover:translate-y-0.5" />
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
} 