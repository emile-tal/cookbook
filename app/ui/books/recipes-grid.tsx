'use client'

import { Book, LiteRecipe } from "@/app/types/definitions";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { addRecipeToBook } from '@/app/lib/data/recipes';
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from 'react';

interface Props {
    recipes: LiteRecipe[] | null,
    edit: boolean,
    books: Book[] | null
}

export default function RecipesGrid({ recipes, edit, books }: Props) {
    const router = useRouter();
    const [showBooks, setShowBooks] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

    const handleAddRecipeToBook = async (bookId: string, recipeId: string) => {
        await addRecipeToBook(bookId, recipeId);
        setShowBooks(false);
        setSelectedRecipe(null);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes?.map((recipe) => (
                <div
                    key={recipe.id}
                    className='p-4 bg-white border border-gray-100 rounded-xl shadow-md hover:cursor-pointer transition-shadow hover:shadow-lg'
                    onClick={() => router.push(`/recipe/${recipe.id}`)}
                >
                    <div className={clsx("flex w-full h-48 relative", showBooks && selectedRecipe === recipe.id ? "bg-gray-50 rounded-t-xl hover:cursor-default" : "items-center justify-center ")}>
                        {showBooks && selectedRecipe === recipe.id ? (
                            <div className="flex flex-col w-full h-full p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">Add to Book</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowBooks(false);
                                            setSelectedRecipe(null);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {books?.map((book) => (
                                        <button
                                            key={book.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddRecipeToBook(book.id, recipe.id);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 mb-2 text-left rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <RestaurantIcon className="text-gray-500" />
                                            <span className="text-gray-700">{book.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            recipe.image_url ? (
                                <Image
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    fill
                                    className="object-cover rounded-t-xl max-w-full"
                                />
                            ) : (
                                <RestaurantIcon className="w-full h-full text-gray-300 bg-gray-100 rounded-t-xl" />
                            ))}
                        {edit && (<button
                            className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/recipe/${recipe.id}/edit`);
                            }}>
                            <EditIcon className="text-text text-base group-hover:text-lg" />
                        </button>)}
                        <button
                            className="absolute top-1 left-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                showBooks ? setShowBooks(false) : setShowBooks(true);
                                selectedRecipe === recipe.id ? setSelectedRecipe(null) : setSelectedRecipe(recipe.id);
                            }}>
                            <AddIcon className="text-text text-base group-hover:text-lg" />
                        </button>
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