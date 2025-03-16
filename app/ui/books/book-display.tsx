'use client'

import { useMemo, useState } from "react";

import { Book } from "@/app/lib/definitions";
import BooksList from "./books-list";
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useRouter } from 'next/navigation';
import { useView } from "@/app/context/view-context";

const tableHeaders = [
    {
        label: "Name",
        sort: "name",
        column: 5
    },
    {
        label: "Owner",
        sort: "owner",
        column: 5
    },
    {
        label: "Recipes",
        sort: "recipes",
        column: 2
    }
];

interface Props {
    books: Book[];
    recipeCountByBook?: Record<string, number>;
}

export function BookDisplay({ books, recipeCountByBook = {} }: Props) {
    const router = useRouter();
    const { view } = useView();
    const [sort, setSort] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (header: string) => {
        if (sort === header) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSort(header);
            setSortDirection("asc");
        }
    };

    const sortedBooks = useMemo(() => {
        if (!books) return [];
        return [...books].sort((a, b) => {
            if (sort === "name") {
                return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (sort === "owner") {
                return sortDirection === "asc" ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
            } else if (sort === "recipes") {
                const countA = recipeCountByBook[a.id] || 0;
                const countB = recipeCountByBook[b.id] || 0;
                return sortDirection === "asc" ? countA - countB : countB - countA;
            }
            return 0;
        });
    }, [books, sort, sortDirection, recipeCountByBook]);

    if (!books || books.length === 0) {
        return <div>No books found.</div>;
    }

    return (
        <div className="py-4 w-full">
            {view === "list" ? (
                <>
                    <div className="grid grid-cols-12 py-2 font-bold border-b border-gray-200">
                        {tableHeaders.map((header) => (
                            <div
                                key={header.sort}
                                className={`col-span-${header.column} flex gap-2 hover:cursor-pointer ${header.sort === "recipes" ? "justify-end" : ""}`}
                                onClick={() => handleSort(header.sort)}
                            >
                                <h3>{header.label}</h3>
                                <SwapVertIcon />
                            </div>
                        ))}
                    </div>
                    <BooksList books={sortedBooks} recipeCountByBook={recipeCountByBook} />
                </>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedBooks.map((book) => (
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
            )}
        </div>
    );
}