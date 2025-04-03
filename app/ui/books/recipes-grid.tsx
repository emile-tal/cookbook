'use client'

import { Book, LiteRecipe } from "@/app/types/definitions";
import { useEffect, useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import Image from "next/image";
import MenuBook from "@mui/icons-material/MenuBook";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { addRecipeToBook } from '@/app/lib/data/recipes';
import clsx from "clsx";
import { createBookWithRecipe } from "@/app/lib/data/recipeBook";
import { useRouter } from "next/navigation";

interface Props {
    recipes: LiteRecipe[] | null,
    edit: boolean,
    books: Book[] | null
}

export default function RecipesGrid({ recipes, edit, books }: Props) {
    const router = useRouter();
    const [showBooks, setShowBooks] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
    const [newBookInputVisible, setNewBookInputVisible] = useState(false);
    const [newBook, setNewBook] = useState('');
    const newBookInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (newBookInputVisible && newBookInputRef.current) {
            newBookInputRef.current.focus();
        }
    }, [newBookInputVisible]);

    const handleAddRecipeToBook = async (bookId: string, recipeId: string) => {
        await addRecipeToBook(bookId, recipeId);
        setShowBooks(false);
        setSelectedRecipe(null);
    }

    const handleCreateBookWithRecipe = async (recipeId: string) => {
        await createBookWithRecipe(newBook, recipeId);
        setNewBookInputVisible(false);
        setNewBook('');
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
                            <div className="flex flex-col min-w-full h-full">
                                <div className="flex items-center justify-between px-4 py-2 border-b min-w-full">
                                    <h3 className="text-lg font-semibold text-gray-800">Add to Book</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowBooks(false);
                                            setSelectedRecipe(null);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {newBookInputVisible ? (
                                        <div className="flex gap-2">
                                            <input
                                                ref={newBookInputRef}
                                                value={newBook}
                                                onChange={(e) => setNewBook(e.target.value)}
                                                className="w-full px-4 py-2 border-b last:border-b-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreateBookWithRecipe(recipe.id);
                                                    setNewBookInputVisible(false);
                                                }}
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewBookInputVisible(true)
                                            }}
                                            className="min-w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b last:border-b-0"
                                        >
                                            <span className="text-gray-700 text-left">New Book</span>
                                        </button>
                                    )}
                                    {books?.map((book) => (
                                        <button
                                            key={book.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddRecipeToBook(book.id, recipe.id);
                                            }}
                                            className="min-w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b last:border-b-0"
                                        >
                                            <MenuBook className="text-gray-500 flex-shrink-0" />
                                            <span className="text-gray-700 truncate">{book.name}</span>
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
                        {(edit && (!showBooks || selectedRecipe !== recipe.id)) && (<button
                            className="absolute top-1 left-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/recipe/${recipe.id}/edit`);
                            }}>
                            <EditIcon className="text-text text-base group-hover:text-lg" />
                        </button>)}
                        {(showBooks && selectedRecipe === recipe.id) || <button
                            className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                showBooks ? setShowBooks(false) : setShowBooks(true);
                                selectedRecipe === recipe.id ? setSelectedRecipe(null) : setSelectedRecipe(recipe.id);
                            }}>
                            <AddIcon className="text-text text-base group-hover:text-lg" />
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