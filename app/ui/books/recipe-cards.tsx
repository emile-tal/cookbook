'use client'

import Image from "next/image";
import { LiteRecipe } from "@/app/lib/definitions";
import { useRouter } from 'next/navigation';
import { useView } from "@/app/context/view-context";

interface Props {
    recipes: LiteRecipe[]
}

export function RecipeCards({ recipes }: Props) {
    const router = useRouter();
    const { view } = useView()

    return (
        recipes?.map((recipe) => (
            <div key={recipe.id} onClick={() => router.push(`/recipe/${recipe.id}`)} className='h-32 max-w-32 bg-background hover:cursor-pointer'>
                <Image src={recipe.image_url} alt={recipe.title} width={100} height={100} />
                <span>{recipe.title}</span>
            </div>
        ))
    )
}