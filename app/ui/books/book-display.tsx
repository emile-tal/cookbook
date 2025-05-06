'use client'

import { useMemo, useState } from "react";

import { Book } from "@/app/types/definitions";
import BooksGrid from "./books-grid";
import BooksList from "./books-list";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useDisplayView } from "@/app/context/display-view-context";

const tableHeaders = [
    {
        label: "Name",
        sort: "name",
        column: 4
    },
    {
        label: "Owner",
        sort: "owner",
        column: 4
    },
    {
        label: "Recipes",
        sort: "recipes",
        column: 3
    }
];

interface Props {
    books: Book[];
    editableBooks: Book[];
    savedBooks?: string[];
}

export function BookDisplay({ books, editableBooks, savedBooks = [] }: Props) {
    const { displayView } = useDisplayView();
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
                const countA = a.recipe_count || 0;
                const countB = b.recipe_count || 0;
                return sortDirection === "asc" ? countA - countB : countB - countA;
            }
            return 0;
        });
    }, [books, sort, sortDirection]);

    if (!books || books.length === 0) {
        return <div>No books found.</div>;
    }

    return (
        <div className="w-full">
            {displayView === "list" ? (
                <>
                    <div className="grid grid-cols-12 gap-2 pt-2 pb-4 px-2 font-bold border-b border-gray-200">
                        {tableHeaders.map((header) => (
                            <div
                                key={header.sort}
                                className={`col-span-${header.column} flex gap-0 sm:gap-2 hover:cursor-pointer`}
                                onClick={() => handleSort(header.sort)}
                            >
                                <h3 className="text-sm md:text-base">{header.label}</h3>
                                <div className="scale-75 sm:scale-100 flex items-center justify-start">
                                    <SwapVertIcon />
                                </div>
                            </div>
                        ))}
                    </div>
                    <BooksList books={sortedBooks} savedBooks={savedBooks} editableBooks={editableBooks.map((book) => book.id)} />
                </>
            ) : (
                <BooksGrid books={sortedBooks} savedBooks={savedBooks} editableBooks={editableBooks.map((book) => book.id)} />
            )}
        </div>
    )
}