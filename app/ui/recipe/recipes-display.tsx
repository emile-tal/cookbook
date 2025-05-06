'use client'

import { Book, LiteRecipe } from "@/app/types/definitions";
import { useMemo, useState } from "react";

import RecipesGrid from "./recipes-grid";
import RecipesList from "./recipes-list";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useDisplayView } from "@/app/context/display-view-context";

const tableHeaders = [
    {
        label: "Title",
        sort: "title",
        column: 5
    },
    {
        label: "Owner",
        sort: "owner",
        column: 3
    },
    {
        label: "Duration",
        sort: "duration",
        column: 2
    }
]

interface Props {
    recipes: LiteRecipe[] | null,
    editableBooks: Book[] | null,
    savedRecipes?: string[]
    editableRecipes: string[]
}

export function RecipesDisplay({ recipes, editableBooks, savedRecipes = [], editableRecipes }: Props) {
    const { displayView } = useDisplayView()
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
            }
            return 0;
        });
    }, [recipes, sort, sortDirection])

    if (recipes === null) {
        return <div>No recipes added to this book yet! Add some recipes to your book to get started.</div>
    }

    return (
        <div>
            {displayView === "list" ? (
                <>
                    <div className="grid grid-cols-12 pt-2 pb-4 px-2 gap-2 font-bold border-b border-gray-200">
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
                    <RecipesList recipes={sortedRecipes} savedRecipes={savedRecipes} editableRecipes={editableRecipes} />
                </>
            ) : (
                <RecipesGrid recipes={sortedRecipes} editableBooks={editableBooks} savedRecipes={savedRecipes} editableRecipes={editableRecipes} />
            )}
        </div >
    )
}