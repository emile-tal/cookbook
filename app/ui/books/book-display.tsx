'use client'

import { useMemo, useState } from "react";

import { Book } from "@/app/types/definitions";
import BooksGrid from "./books-grid";
import BooksList from "./books-list";
import SwapVertIcon from '@mui/icons-material/SwapVert';
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
    savedBooks?: string[];
}

export function BookDisplay({ books, recipeCountByBook = {}, savedBooks = [] }: Props) {
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
                                className={`col-span-${header.column} flex gap-2 hover:cursor-pointer`}
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
                <BooksGrid books={sortedBooks} recipeCountByBook={recipeCountByBook} savedBooks={savedBooks} />
            )}
        </div>
    );
}