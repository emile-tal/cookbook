'use client'

import Image from "next/image";
import { LiteRecipe } from "@/app/lib/definitions";
import clsx from "clsx";
import { useRouter } from 'next/navigation';
import { useView } from "@/app/context/view-context";

interface Props {
    recipes: LiteRecipe[] | null
}

export function RecipeCards({ recipes }: Props) {
    const router = useRouter();
    const { view } = useView()

    if (recipes === null) {
        return <div>No recipes added to this book yet! Add some recipes to your book to get started.</div>
    }

    return (
        <div className="py-4">
            {view === "list" && (
                <div className="grid grid-cols-4 w-full py-2">
                    <h3 className="text-center">Title</h3>
                    <h3 className="text-center">Owner</h3>
                    <h3 className="text-center">Category</h3>
                    <h3 className="text-center">Duration</h3>
                </div>
            )}
            <div className={clsx("flex", view === "grid" ? "flex-wrap gap-4" : "flex-col")}>
                {recipes?.map((recipe) => (
                    <div key={recipe.id} className={clsx('py-2', { "grid grid-cols-4 w-full": view === "list", 'h-lg w-lg bg-background': view === "grid" })}>
                        {view === "grid" && <Image src={recipe.image_url} alt={recipe.title} width={100} height={100} />}
                        <span onClick={() => router.push(`/recipe/${recipe.id}`)} className="hover:cursor-pointer">{recipe.title}</span>
                        {view === "list" && <><span>{recipe.username}</span>
                            {/* <span>{recipe.category}</span> */}
                            {/* <span>{recipe.duration}</span> */}
                        </>}
                    </div>
                ))}
            </div>
        </div >
    )
}