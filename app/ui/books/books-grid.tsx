'use client'

import { addSavedBook, removeSavedBook } from "@/app/lib/data/recipebooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Book } from "@/app/types/definitions";
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import ShareDialog from "@/app/components/ShareDialog";
import ShareIcon from '@mui/icons-material/Share';
import TurnedIn from '@mui/icons-material/TurnedIn';
import TurnedInNot from '@mui/icons-material/TurnedInNot';
import { sendInvitation } from "@/app/lib/data/invitations";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Props {
    books: Book[];
    savedBooks: string[];
}

export default function BooksGrid({ books, savedBooks = [] }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedBook, setSelectedBook] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
    const fullUrl = pathname + '?' + searchParams.toString();


    if (status === 'loading') {
        return <div>Loading...</div>
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books?.map((book) => {
                const saved = savedBooks.includes(book.id);
                return (
                    <div
                        key={book.id}
                        className="p-4 bg-white border border-gray-100 rounded-xl shadow-md hover:cursor-pointer transition-shadow hover:shadow-lg"
                        onClick={() => router.push(`/books/${book.id}?from=${fullUrl}`)}
                    >
                        <div className="flex items-center justify-center w-full h-48 relative bg-gray-50 rounded-t-xl">
                            {book.image_url ? (
                                <Image
                                    src={book.image_url}
                                    alt={book.name}
                                    fill
                                    className="object-cover rounded-t-xl max-w-full"
                                />
                            ) : (
                                <MenuBookIcon className="w-full h-full text-gray-300 scale-[300%]" />
                            )}
                            <button
                                className="absolute top-1.5 right-1.5 flex items-center justify-center bg-gray-50 rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white transition-all duration-200 group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBook(book.id)
                                    setShowMenu(true)
                                }}>
                                <MenuIcon className="text-text text-base group-hover:text-lg" />
                            </button>
                            {showMenu && selectedBook === book.id && (
                                <div className="absolute top-0 right-0 flex flex-col gap-2 h-full bg-gray-100 rounded-tr-xl p-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(false)
                                        }}
                                        className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group">
                                        <span className="text-text text-xl group-hover:text-lg">
                                            ✕
                                        </span>
                                    </button>
                                    {(session?.user?.username === book.username) && <button
                                        className="flex items-center justify-center bg-gray-100 rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/books/${book.id}/edit?from=${fullUrl}`);
                                        }}>
                                        <EditIcon className="text-text text-base group-hover:text-lg" />
                                    </button>}
                                    <button
                                        className="flex items-center justify-center bg-gray-100 rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (saved) {
                                                removeSavedBook(book.id);
                                                router.refresh();
                                            } else {
                                                addSavedBook(book.id);
                                                router.refresh();
                                            }
                                        }}>
                                        {saved ? (
                                            <TurnedIn className="text-red-400 text-base group-hover:text-lg" />
                                        ) : (
                                            <TurnedInNot className="text-text text-base group-hover:text-lg" />
                                        )}
                                    </button>
                                    {(session?.user?.username === book.username) && <button
                                        className="flex items-center justify-center bg-gray-100 rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowShareDialog(true);
                                        }}>
                                        <ShareIcon className="text-text text-base group-hover:text-lg" />
                                    </button>}
                                </div>
                            )}
                        </div>

                        <div className="pt-3 pb-2">
                            <h3 className="font-medium text-lg">{book.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-600">By {book.username}</p>
                                <span className="text-xs text-gray-500">{book.recipe_count} recipes</span>
                            </div>
                        </div>
                    </div>
                )
            })}
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