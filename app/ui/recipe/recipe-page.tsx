'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BackButton } from "./back-button";
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import { Recipe } from '@/app/types/definitions';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface Props {
    recipe: Recipe;
    username: string | null;
}

export default function RecipePage({ recipe, username }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const fullUrl = pathname + '?' + searchParams.toString();

    // Ensure ingredients and instructions are arrays (avoid potential issues)
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
    const categories = Array.isArray(recipe.categories) ? recipe.categories : [];

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
                {/* Back arrow positioned outside the centered content */}
                <div className="w-full flex justify-start mb-4">
                    <BackButton />
                </div>
                <div className="flex flex-col items-center">
                    {/* Recipe header section */}
                    <div className="w-full flex flex-col items-center mb-8">
                        {recipe.image_url ? (
                            <div className="w-[200px] h-[200px] mb-6 relative">
                                <Image
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-100 rounded-lg mb-6">
                                <RestaurantIcon className="text-gray-300 scale-[200%]" />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                            <h1 className="text-3xl font-bold text-center">{recipe.title}</h1>
                            {username === recipe.username &&
                                (<button
                                    onClick={() => router.push(`/recipe/${recipe.id}/edit?from=${fullUrl}`)}
                                    className="flex items-center justify-center bg-white rounded-full p-1 hover:bg-gray-100">
                                    <EditIcon className="text-gray-600 hover:text-gray-900" fontSize="small" />
                                </button>)}
                        </div>
                        {recipe.description && (
                            <p className="text-center text-gray-600 max-w-2xl mb-2">{recipe.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-gray-500">
                            <span>By {recipe.username}</span>
                            {recipe.duration > 0 && <span>{recipe.duration} minutes</span>}
                        </div>
                        {categories.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2 justify-center">
                                {categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="text-sm px-2.5 py-1 rounded-md bg-secondary bg-opacity-10 text-secondary font-medium"
                                    >
                                        {typeof category === 'string' ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recipe content */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Ingredients section */}
                        <aside className="lg:col-span-1">
                            <h2 className="text-xl font-bold pb-3 border-b border-gray-200 mb-4">Ingredients</h2>
                            {ingredients.length > 0 ? (
                                <div className="space-y-3">
                                    {ingredients.map((ingredient, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-2">
                                            <span className="col-span-1 text-gray-600">{ingredient.amount}</span>
                                            <span className="col-span-2">{ingredient.ingredient}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No ingredients listed</p>
                            )}
                        </aside>

                        {/* Instructions section */}
                        <div className="lg:col-span-3">
                            <h2 className="text-xl font-bold pb-3 border-b border-gray-200 mb-4">Instructions</h2>
                            {instructions.length > 0 ? (
                                <div className="space-y-6">
                                    {instructions.sort((a, b) => a.position - b.position).map((instruction, index) => (
                                        <div key={index} className="flex gap-4">
                                            <span className="text-2xl font-bold text-gray-400 shrink-0 w-8 text-right">
                                                {instruction.position}
                                            </span>
                                            <span className="pt-1 flex-1">{instruction.instruction}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No instructions listed</p>
                            )}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}