'use client'

import { Book, LiteRecipe } from "@/app/types/definitions";
import { addRecipeToBook, removeRecipeFromBook } from '@/app/lib/data/recipes';
import { createBookWithRecipe, fetchBookIdsByRecipeId } from "@/app/lib/data/recipeBook";
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import Image from "next/image";
import MenuBook from "@mui/icons-material/MenuBook";
import MenuIcon from '@mui/icons-material/Menu';
import RemoveIcon from '@mui/icons-material/Remove';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import clsx from "clsx";
import { useSession } from "next-auth/react";

interface Props {
    recipes: LiteRecipe[] | null,
    userBooks: Book[] | null
}

export default function RecipesGrid({ recipes, userBooks }: Props) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showBooks, setShowBooks] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
    const [newBookInputVisible, setNewBookInputVisible] = useState(false);
    const [newBook, setNewBook] = useState('');
    const newBookInputRef = useRef<HTMLInputElement>(null);
    const [errorAddingRecipe, setErrorAddingRecipe] = useState(false);
    const [bookIdsWithRecipe, setBookIdsWithRecipe] = useState<string[]>([]);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (newBookInputVisible && newBookInputRef.current) {
            newBookInputRef.current.focus();
        }
    }, [newBookInputVisible]);

    const fullUrl = pathname + '?' + searchParams.toString();

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    const handleAddRecipeToBook = async (bookId: string, recipeId: string) => {
        await addRecipeToBook(bookId, recipeId);
        handleCloseMenus();
    }

    const handleRemoveRecipeFromBook = async (bookId: string, recipeId: string) => {
        await removeRecipeFromBook(bookId, recipeId);
        handleCloseMenus();
    }

    const handleCreateBookWithRecipe = async (recipeId: string) => {
        await createBookWithRecipe(newBook, recipeId);
        setNewBookInputVisible(false);
        setNewBook('');
        setShowBooks(false);
        setSelectedRecipe(null);
    }

    const handleShowBooks = async (recipeId: string) => {
        const bookIds = await fetchBookIdsByRecipeId(recipeId);
        setShowBooks(true);
        setSelectedRecipe(recipeId);
        setShowMenu(false);
        setBookIdsWithRecipe(bookIds.map((book) => book.book_id));
    }

    const handleCloseMenus = () => {
        setShowBooks(false);
        setSelectedRecipe(null);
        setBookIdsWithRecipe([]);
        setErrorAddingRecipe(false);
        setNewBookInputVisible(false);
        setNewBook('');
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes?.map((recipe) => (
                <div
                    key={recipe.id}
                    className='p-4 bg-white border border-gray-100 rounded-xl shadow-md hover:cursor-pointer transition-shadow hover:shadow-lg'
                    onClick={() => router.push(`/recipe/${recipe.id}?from=${fullUrl}`)}
                >
                    <div className={clsx("flex w-full h-48 relative rounded-t-xl", showBooks && selectedRecipe === recipe.id ? "bg-gray-50 hover:cursor-default" : "items-center justify-center bg-gray-50")}>
                        {showBooks && selectedRecipe === recipe.id ? (
                            <div className="flex flex-col min-w-full h-full">
                                <div className=" px-4 py-2 border-b min-w-full">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-800">Add to Book</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseMenus();
                                            }}
                                            className="text-gray-500 hover:text-gray-700 p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {errorAddingRecipe && (
                                        <div className="flex items-center gap-2  mt-2">
                                            <ErrorIcon className="text-red-500 scale-75" />
                                            <p className="text-red-500 text-sm">Recipe already in book</p>
                                        </div>
                                    )}
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
                                    {userBooks?.map((book) => (
                                        <div key={book.id} className="min-w-full flex items-center justify-between px-4 py-2 border-b last:border-b-0">
                                            <span className={`text-gray-700 truncate ${bookIdsWithRecipe.includes(book.id) ? "font-bold" : ""}`}>{book.name}</span>
                                            {bookIdsWithRecipe.includes(book.id) ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveRecipeFromBook(book.id, recipe.id);
                                                    }}>
                                                    <RemoveIcon className="text-gray-500 scale-75 hover:text-gray-700 hover:scale-100 transition-all" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddRecipeToBook(book.id, recipe.id);
                                                    }}>
                                                    <AddIcon className="text-gray-500 scale-75 hover:text-gray-700 hover:scale-100 transition-all" />
                                                </button>
                                            )}
                                        </div>
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
                                <RestaurantIcon className="scale-[200%] text-gray-300 " />
                            ))}
                        {(showBooks && selectedRecipe === recipe.id) || <button
                            className="absolute top-1.5 right-1.5 flex items-center justify-center bg-white rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-gray-100 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedRecipe === recipe.id) {
                                    setSelectedRecipe(null)
                                    setShowMenu(false)
                                } else {
                                    setSelectedRecipe(recipe.id)
                                    setShowMenu(true)
                                    setShowBooks(false)
                                }
                            }}>
                            <MenuIcon className="text-text text-base group-hover:text-lg" />
                        </button>}
                        {showMenu && selectedRecipe === recipe.id && (
                            <div className="absolute top-0 right-0 flex flex-col gap-2 h-full bg-gray-100 rounded-tr-xl p-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloseMenus();
                                    }}
                                    className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group">
                                    <span className="text-text text-xl group-hover:text-lg">
                                        ✕
                                    </span>
                                </button>
                                {session?.user?.username === recipe.username && (!showBooks || selectedRecipe !== recipe.id) && (<button
                                    className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/recipe/${recipe.id}/edit?from=${fullUrl}`);
                                    }}>
                                    <EditIcon className="text-text text-base group-hover:text-lg" />
                                </button>)}
                                <button
                                    className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowBooks(recipe.id);
                                    }}
                                >
                                    <MenuBook className="text-text text-base group-hover:text-lg" />
                                </button>
                            </div>
                        )}
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