'use client'

import { addSavedBook, removeSavedBook } from "@/app/lib/data/recipeBook";

import { Book } from "@/app/types/definitions";
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TurnedIn from '@mui/icons-material/TurnedIn';
import TurnedInNot from '@mui/icons-material/TurnedInNot';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
    books: Book[];
    recipeCountByBook?: Record<string, number>;
    savedBooks: string[];
}

export default function BooksGrid({ books, recipeCountByBook = {}, savedBooks = [] }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();

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
                        onClick={() => router.push(`/books/${book.id}`)}
                    >
                        <div className="flex items-center justify-center w-full h-48 relative">
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
                            {(session?.user?.username === book.username) && <button
                                className="absolute top-1 left-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/books/${book.id}/edit`);
                                }}>
                                <EditIcon className="text-text text-base group-hover:text-lg" />
                            </button>}
                            <button
                                className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
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
                                    <TurnedIn className="text-red-500 text-base group-hover:text-lg" />
                                ) : (
                                    <TurnedInNot className="text-text text-base group-hover:text-lg" />
                                )}
                            </button>
                        </div>

                        <div className="pt-3 pb-2">
                            <h3 className="font-medium text-lg">{book.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-600">By {book.username}</p>
                                <span className="text-xs text-gray-500">{recipeCountByBook[book.id] || 0} recipes</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
} 