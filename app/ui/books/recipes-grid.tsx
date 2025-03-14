'use client'

import Image from "next/image";
import { LiteRecipe } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

interface Props {
    recipes: LiteRecipe[] | null
}

export default function RecipesList({ recipes }: Props) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-6 gap-4">
            {recipes?.map((recipe) => (
                <div key={recipe.id} className='p-6 bg-white border border-gray-100 rounded-2xl shadow-md'>
                    <div className="flex items-center justify-center p-4 w-full h-full">
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            width={100}
                            height={100}
                            onClick={() => router.push(`/recipe/${recipe.id}`)}
                            className="hover:cursor-pointer" />
                    </div>
                    <p onClick={() => router.push(`/recipe/${recipe.id}`)} className="hover:cursor-pointer">{recipe.title}</p>
                </div>
            ))}
        </div>
    )
}