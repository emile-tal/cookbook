'use client'

import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import { LiteRecipe } from "@/app/types/definitions";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useRouter } from "next/navigation";
interface Props {
    recipes: LiteRecipe[] | null,
    edit: boolean
}

export default function RecipesGrid({ recipes, edit }: Props) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes?.map((recipe) => (
                <div
                    key={recipe.id}
                    className='p-4 bg-white border border-gray-100 rounded-xl shadow-md hover:cursor-pointer transition-shadow hover:shadow-lg'
                    onClick={() => router.push(`/recipe/${recipe.id}`)}
                >
                    <div className="flex items-center justify-center w-full h-48 relative">
                        {recipe.image_url ? (
                            <Image
                                src={recipe.image_url}
                                alt={recipe.title}
                                fill
                                className="object-cover rounded-t-xl max-w-full"
                            />
                        ) : (
                            <RestaurantIcon className="w-full h-full text-gray-300" />
                        )}
                        {edit && <button
                            className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/recipe/${recipe.id}/edit`);
                            }}>
                            <EditIcon className="text-text text-base group-hover:text-lg" />
                        </button>}
                    </div>
                    <div className="pt-3 pb-2">
                        <h3 className="font-medium text-lg">{recipe.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-600">By {recipe.username}</p>
                            {recipe.category && (
                                <span className="text-xs text-gray-500">{recipe.category}</span>
                            )}
                        </div>
                        {recipe.duration > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{recipe.duration} minutes</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}