'use client'

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Book } from '@/app/types/definitions';
import BookContextMenu from '@/app/components/BookContextMenu';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../buttons/icon-button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareDialog from '@/app/components/ShareDialog';
import ShareIcon from '@mui/icons-material/Share';
import TurnedIn from '@mui/icons-material/TurnedIn';
import TurnedInNot from '@mui/icons-material/TurnedInNot';
import { addSavedBook } from '@/app/lib/data/recipebooks';
import { removeSavedBook } from '@/app/lib/data/recipebooks';
import { sendBookInvitation } from '@/app/lib/data/recipebookinvitations';
import { useSession } from 'next-auth/react';

interface Props {
    books: Book[];
    savedBooks: string[];
    editableBooks: string[];
}

export default function BooksList({ books, savedBooks = [], editableBooks }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState<string | null>(null);
    const fullUrl = pathname + '?' + searchParams.toString();
    const [menuVisible, setMenuVisible] = useState(false);
    const [rawClick, setRawClick] = useState<{ x: number, y: number } | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null)

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    const handleContextMenu = (e: React.MouseEvent, bookId: string) => {
        e.preventDefault();
        setSelectedBook(bookId);
        setRawClick({ x: e.clientX, y: e.clientY });
        setMenuVisible(true);
    };

    useEffect(() => {
        if (menuVisible && rawClick && menuRef.current) {
            const menuW = menuRef.current.offsetWidth;
            const menuH = menuRef.current.offsetHeight;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            const adjustedX = rawClick.x + menuW > screenW ? screenW - menuW : rawClick.x;
            const adjustedY = rawClick.y + menuH > screenH ? screenH - menuH : rawClick.y;

            setPosition({ x: adjustedX, y: adjustedY });
        }
    }, [menuVisible, rawClick]);

    const handleSave = (bookId: string) => {
        if (savedBooks.includes(bookId)) {
            removeSavedBook(bookId);
        } else {
            addSavedBook(bookId);
        }
        router.refresh();
    }

    return (
        <div className="flex flex-col w-full">
            {books?.map((book) => (
                <div
                    key={book.id}
                    className={`py-3 px-2 grid grid-cols-12 gap-2 w-full border-b border-gray-100 items-center hover:cursor-pointer hover:bg-gray-50 ${menuVisible && selectedBook === book.id ? "bg-gray-100" : ""}`}
                    onClick={() => router.push(`/books/${book.id}?from=${fullUrl}`)}
                    onContextMenu={(e) => handleContextMenu(e, book.id)}
                >
                    <p className="col-span-4 truncate text-sm md:text-base">{book.name}</p>
                    <p className="col-span-4 truncate text-sm md:text-base">{book.username}</p>
                    <p className="col-span-3 truncate text-sm md:text-base">{book.recipe_count} recipes</p>
                    <div className="col-span-1 justify-end gap-2 hidden lg:flex">
                        {editableBooks.includes(book.id) &&
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
                        {session && <IconButton
                            onClick={() => handleSave(book.id)}
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
                        />}
                    </div>
                    <div className="col-span-1 justify-end gap-2 hidden sm:flex lg:hidden">
                        <IconButton
                            onClick={(e) => handleContextMenu(e, book.id)}
                            icon={MoreVertIcon}
                            tooltipTitle="Options"
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
                        sendBookInvitation(selectedBook, email, message, permission)
                    }
                    setShowShareDialog(false)
                }}
                name={books.find((book) => book.id === selectedBook)?.name || ''}
            />
            {menuVisible && selectedBook &&
                <BookContextMenu
                    ref={menuRef}
                    position={position}
                    bookId={selectedBook}
                    onClose={() => setMenuVisible(false)}
                    fullUrl={fullUrl}
                    saved={savedBooks.includes(selectedBook)}
                    saveHandler={handleSave}
                    editable={editableBooks.includes(selectedBook)}
                    shareable={session?.user?.username === books.find((book) => book.id === selectedBook)?.username}
                    shareHandler={() => {
                        if (selectedBook) {
                            setShowShareDialog(true);
                        }
                    }}
                />}
        </div>
    );
} 