'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Book } from '@/app/types/definitions';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../buttons/icon-button';
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
                <div
                    key={book.id}
                    className='py-3 grid grid-cols-12 w-full border-b border-gray-100 items-center hover:cursor-pointer'
                    onClick={() => router.push(`/books/${book.id}?from=${fullUrl}`)}
                >
                    <div className="col-span-5 flex items-center gap-2">
                        <p className=" font-medium truncate">
                            {book.name}
                        </p>
                    </div>
                    <p className="col-span-4 truncate">{book.username}</p>
                    <div className="col-span-2 items-center">
                        <span>{book.recipe_count} recipes</span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                        {session?.user?.username === book.username &&
                            <IconButton
                                onClick={() => router.push(`/books/${book.id}/edit?from=${fullUrl}`)}
                                icon={EditIcon}
                                tooltipTitle="Edit Book"
                                tooltipPlacement="top"
                                variant="light"
                            />
                        }
                        {session?.user?.username === book.username &&
                            <IconButton
                                onClick={() => {
                                    setSelectedBook(book.id);
                                    setShowShareDialog(true);
                                }}
                                icon={ShareIcon}
                                tooltipTitle="Share Book"
                                tooltipPlacement="top"
                                variant="light"
                            />
                        }
                        <IconButton
                            onClick={() => {
                                if (savedBooks.includes(book.id)) {
                                    removeSavedBook(book.id);
                                    router.refresh();
                                } else {
                                    addSavedBook(book.id);
                                    router.refresh();
                                }
                            }}
                            renderIcon={() => {
                                return savedBooks.includes(book.id) ? (
                                    <TurnedIn className="text-primary text-base group-hover:text-lg" />
                                ) : (
                                    <TurnedInNot className="text-text text-base group-hover:text-lg" />
                                )
                            }}
                            tooltipTitle={savedBooks.includes(book.id) ? "Unsave Book" : "Save Book"}
                            tooltipPlacement="top"
                            variant="light"
                        />
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