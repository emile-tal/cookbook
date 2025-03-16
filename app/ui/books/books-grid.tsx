'use client'

import { Book } from "@/app/lib/definitions";
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useRouter } from "next/navigation";

interface Props {
    books: Book[];
    recipeCountByBook?: Record<string, number>;
}

export default function BooksGrid({ books, recipeCountByBook = {} }: Props) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books?.map((book) => (
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
                            <MenuBookIcon className="w-full h-full text-gray-300" />
                        )}
                        <button
                            className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Add edit functionality here when available
                                router.push(`/books/${book.id}`);
                            }}>
                            <EditIcon className="text-text text-base group-hover:text-lg" />
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
            ))}
        </div>
    );
} 