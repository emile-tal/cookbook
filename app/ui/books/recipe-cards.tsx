'use client'

import { useMemo, useState } from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import { LiteRecipe } from "@/app/lib/definitions";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import clsx from "clsx";
import { useRouter } from 'next/navigation';
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
    recipes: LiteRecipe[] | null
}

export function RecipeCards({ recipes }: Props) {
    const router = useRouter();
    const { view } = useView()
    const [sort, setSort] = useState<string>("title")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    if (recipes === null) {
        return <div>No recipes added to this book yet! Add some recipes to your book to get started.</div>
    }

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


    return (
        <div className="py-4">
            {view === "list" &&
                <div className="grid grid-cols-12 py-2 font-bold">
                    {tableHeaders.map((header) => (
                        <div key={header.sort} className={`col-span-${header.column} flex gap-2`}>
                            <h3>{header.label}</h3>
                            <SwapVertIcon className="hover:cursor-pointer" onClick={() => handleSort(header.sort)} />
                        </div>

                    ))}
                </div>}
            <div className={clsx("flex", view === "grid" ? "flex-wrap gap-4" : "flex-col")}>
                {sortedRecipes.map((recipe) => (
                    <div key={recipe.id} className={clsx('py-2', { "grid grid-cols-12 w-full": view === "list", 'h-lg w-lg bg-background': view === "grid" })}>
                        {view === "grid" && <Image src={recipe.image_url} alt={recipe.title} width={100} height={100} onClick={() => router.push(`/recipe/${recipe.id}`)} className="hover:cursor-pointer" />}
                        <p onClick={() => router.push(`/recipe/${recipe.id}`)} className={clsx("hover:cursor-pointer", { "col-span-4": view === "list" })}>{recipe.title}</p>
                        {view === "list" && <>
                            <p className="col-span-3">{recipe.username}</p>
                            <p className="col-span-2">{recipe.category}</p>
                            <p className="col-span-2">{recipe.duration} minutes</p>
                            <div className="col-span-1 flex gap-2 justify-end">
                                <EditIcon />
                                <DeleteIcon />
                            </div>
                        </>}
                    </div>
                ))}
            </div>
        </div >
    )
}