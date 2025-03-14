'use client'

import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import { LiteRecipe } from "@/app/lib/definitions";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useRouter } from "next/navigation";
interface Props {
    recipes: LiteRecipe[] | null
}

export default function RecipesList({ recipes }: Props) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-4 gap-8">
            {recipes?.map((recipe) => (
                <div key={recipe.id} className='p-2 bg-white border border-gray-100 rounded-xl shadow-md hover:cursor-pointer' onClick={() => router.push(`/recipe/${recipe.id}`)}>
                    <div className="flex items-center justify-center w-full h-48 relative">
                        {recipe.image_url ? (<Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover rounded-t-xl max-w-full" />
                        ) : (
                            <RestaurantIcon className="w-full h-full text-gray-300" />)}
                        <div className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group">
                            <EditIcon className="text-text text-base group-hover:text-lg" />
                        </div>
                    </div>
                    <p className="py-2 text-text">{recipe.title}</p>
                </div>
            ))}
        </div>
    )
}