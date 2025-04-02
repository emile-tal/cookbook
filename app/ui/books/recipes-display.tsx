'use client'

import { Book, LiteRecipe } from "@/app/types/definitions";
import { useMemo, useState } from "react";

import RecipesGrid from "./recipes-grid";
import RecipesList from "./recipes-list";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useView } from "@/app/context/view-context";

const tableHeaders = [
    {
        label: "Title",
        sort: "title",
        column: 4
    },
    {
        label: "Owner",
        sort: "owner",
        column: 3
    },
    {
        label: "Category",
        sort: "category",
        column: 2
    },
    {
        label: "Duration",
        sort: "duration",
        column: 2
    }
]

interface Props {
    recipes: LiteRecipe[] | null,
    books: Book[] | null
}

export function RecipesDisplay({ recipes, books }: Props) {
    const { view } = useView()
    const [sort, setSort] = useState<string>("title")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    const handleSort = (header: string) => {
        if (sort === header) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSort(header)
            setSortDirection("asc")
        }
    }

    const sortedRecipes = useMemo(() => {
        if (!recipes) return [];
        return [...recipes].sort((a, b) => {
            if (sort === "duration") {
                return sortDirection === "asc" ? a.duration - b.duration : b.duration - a.duration;
            } else if (sort === "title") {
                return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            } else if (sort === "owner") {
                return sortDirection === "asc" ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
            } else if (sort === "category") {
                return sortDirection === "asc" ? (a.category || '').localeCompare(b.category || '') : (b.category || '').localeCompare(a.category || '');
            }
            return 0;
        });
    }, [recipes, sort, sortDirection])

    if (recipes === null) {
        return <div>No recipes added to this book yet! Add some recipes to your book to get started.</div>
    }

    return (
        <div className="py-4">
            {view === "list" ?
                (
                    <>
                        <div className="grid grid-cols-12 py-2 font-bold">
                            {tableHeaders.map((header) => (
                                <div key={header.sort} className={`col-span-${header.column} flex gap-2 hover:cursor-pointer`} onClick={() => handleSort(header.sort)}>
                                    <h3>{header.label}</h3>
                                    <SwapVertIcon />
                                </div>

                            ))}
                        </div>
                        <RecipesList recipes={sortedRecipes} />
                    </>
                ) : (
                    <RecipesGrid recipes={sortedRecipes} edit={true} books={books} />
                )}
        </div >
    )
}