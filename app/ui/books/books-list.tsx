'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Book } from '@/app/types/definitions';
import EditIcon from '@mui/icons-material/Edit';
import ShareDialog from '@/app/components/ShareDialog';
import ShareIcon from '@mui/icons-material/Share';
import TurnedIn from '@mui/icons-material/TurnedIn';
import TurnedInNot from '@mui/icons-material/TurnedInNot';
import { addSavedBook } from '@/app/lib/data/recipebooks';
import { removeSavedBook } from '@/app/lib/data/recipebooks';
import { sendInvitation } from '@/app/lib/data/invitations';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface Props {
    books: Book[];
    savedBooks: string[];
}

export default function BooksList({ books, savedBooks = [] }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState<string | null>(null);
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
                        <span>{book.recipe_count} recipes</span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                        {session?.user?.username === book.username &&
                            <button
                                onClick={() => router.push(`/books/${book.id}/edit?from=${fullUrl}`)}
                                className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white hover:shadow-sm group"
                            >
                                <EditIcon className="text-text text-base group-hover:text-lg" />
                            </button>
                        }
                        {session?.user?.username === book.username && <button
                            onClick={() => {
                                setSelectedBook(book.id);
                                setShowShareDialog(true);
                            }}
                            className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white hover:shadow-sm group"
                        >
                            <ShareIcon className="text-text text-base group-hover:text-lg" />
                        </button>}
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
                            className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white hover:shadow-sm group"
                        >
                            {savedBooks.includes(book.id) ? (
                                <TurnedIn className="text-red-500 text-base group-hover:text-lg" />
                            ) : (
                                <TurnedInNot className="text-text text-base group-hover:text-lg" />
                            )}
                        </button>
                    </div>
                </div>
            ))}
            <ShareDialog
                open={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                onShare={(email, message, permission) => {
                    if (selectedBook) {
                        sendInvitation(selectedBook, email, message, permission)
                    }
                    setShowShareDialog(false)
                }}
                bookName={books.find((book) => book.id === selectedBook)?.name || ''}
            />
        </div>
    );
} 