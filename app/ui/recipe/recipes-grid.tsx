'use client'

import { Book, LiteRecipe } from "@/app/types/definitions";
import { addRecipeToBook, addSavedRecipe, removeRecipeFromBook, removeSavedRecipe } from '@/app/lib/data/recipes';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "../buttons/icon-button";
import Image from "next/image";
import MenuBook from "@mui/icons-material/MenuBook";
import MenuIcon from '@mui/icons-material/Menu';
import NewBookDialog from "@/app/components/NewBookDialog";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Session } from "next-auth";
import ShareDialog from "@/app/components/ShareDialog";
import ShareIcon from "@mui/icons-material/Share";
import { TurnedIn } from "@mui/icons-material";
import TurnedInNot from "@mui/icons-material/TurnedInNot";
import clsx from "clsx";
import { createBookWithRecipe } from "@/app/lib/data/recipebooks";
import { fetchBookIdsByRecipeId } from "@/app/lib/data/recipebooks/fetch";
import { sendRecipeInvitation } from "@/app/lib/data/recipeinvitations";
import { useSession } from "next-auth/react";
import { useState } from 'react';

interface Props {
    recipes: LiteRecipe[] | null,
    editableBooks: Book[] | null,
    savedRecipes?: string[]
    editableRecipes?: string[]
}

export default function RecipesGrid({ recipes, editableBooks, savedRecipes = [], editableRecipes }: Props) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showBooks, setShowBooks] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
    const [bookIdsWithRecipe, setBookIdsWithRecipe] = useState<string[]>([]);
    const [openNewBookDialog, setOpenNewBookDialog] = useState(false);
    const { data: session, status } = useSession() as { data: Session | null, status: string }
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showShareDialog, setShowShareDialog] = useState(false);

    const fullUrl = pathname + '?' + searchParams.toString();

    if (status === 'loading') {
        return <div>Loading...</div>
    }


    const handleToggleRecipeInBook = async (bookId: string) => {
        if (!selectedRecipe) {
            return;
        }
        if (bookIdsWithRecipe.includes(bookId)) {
            await removeRecipeFromBook(bookId, selectedRecipe);
        } else {
            await addRecipeToBook(bookId, selectedRecipe);
        }
        setBookIdsWithRecipe(bookIdsWithRecipe.includes(bookId) ? bookIdsWithRecipe.filter((id) => id !== bookId) : [...bookIdsWithRecipe, bookId]);
    }

    const handleCreateBook = async (recipeBookName: string) => {
        if (selectedRecipe) {
            await createBookWithRecipe(recipeBookName, selectedRecipe);
        }
        setOpenNewBookDialog(false);
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
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes?.map((recipe) => {
                const saved = savedRecipes.includes(recipe.id);
                return (
                    <div
                        key={recipe.id}
                        className='p-4 bg-white border border-gray-100 rounded-xl shadow-md hover:cursor-pointer transition-shadow hover:shadow-lg'
                        onClick={() => router.push(`/recipe/${recipe.id}?from=${fullUrl}`)}
                    >
                        <div className={clsx("flex w-full h-48 relative rounded-t-xl bg-white", showBooks && selectedRecipe === recipe.id ? "hover:cursor-default" : "items-center justify-center")}>
                            {showBooks && selectedRecipe === recipe.id ? (
                                <div className="flex flex-col min-w-full h-full">
                                    <div className="flex items-center min-w-full rounded-xl mb-2 relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenNewBookDialog(true);
                                            }}
                                            className="rounded-xl min-h-full min-w-full px-4 py-4 hover:cursor-pointer hover:shadow-sm bg-gray-50 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center gap-2">
                                                <MenuBook className="scale-75 text-gray-500" />
                                                <span className="text-gray-700 text-xl">New Book</span>
                                            </div>
                                        </button>
                                        <div className="absolute right-2 top-[13px]">
                                            <IconButton
                                                onClick={() => {
                                                    handleCloseMenus();
                                                }}
                                                icon={CloseIcon}
                                                tooltipTitle="Close"
                                                tooltipPlacement="bottom"
                                                variant="light"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        {editableBooks?.map((book) => (
                                            <button
                                                key={book.id}
                                                className="min-w-full flex items-center justify-between px-4 py-2 border-b last:border-b-0 bg-gray-50 hover:cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleRecipeInBook(book.id);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MenuBook className={`scale-75 text-gray-500`} />
                                                    <span className={`text-gray-700 truncate`}>{book.name}</span>
                                                </div>
                                                {bookIdsWithRecipe.includes(book.id) && (
                                                    <CheckIcon className="text-gray-700 scale-75" />
                                                )}
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
                                    <div className="flex items-center justify-center min-h-full min-w-full bg-gray-50 rounded-t-xl">
                                        <RestaurantIcon className="scale-[200%] text-gray-300" />
                                    </div>
                                )
                            )}
                            {session?.user && ((showBooks && selectedRecipe === recipe.id) || <div
                                className="absolute top-1.5 right-1.5">
                                <IconButton
                                    onClick={() => {
                                        setSelectedRecipe(recipe.id)
                                        setShowMenu(true)
                                        setShowBooks(false)
                                    }}
                                    icon={MenuIcon}
                                    tooltipTitle="Menu"
                                    tooltipPlacement="right"
                                    variant="light"
                                />
                            </div>)}
                            {showMenu && selectedRecipe === recipe.id && (
                                <div className="absolute top-0 right-0 flex flex-col gap-1 h-full bg-gray-100 rounded-tr-xl p-2">
                                    <IconButton
                                        onClick={() => {
                                            handleCloseMenus();
                                        }}
                                        icon={CloseIcon}
                                        tooltipTitle="Close"
                                        tooltipPlacement="right"
                                        variant="dark"
                                    />
                                    {editableRecipes?.includes(recipe.id) && (!showBooks) && (
                                        <IconButton
                                            onClick={() => {
                                                router.push(`/recipe/${recipe.id}/edit?from=${fullUrl}`);
                                            }}
                                            icon={EditIcon}
                                            tooltipTitle="Edit"
                                            tooltipPlacement="right"
                                            variant="dark"
                                        />
                                    )}
                                    <IconButton
                                        onClick={() => {
                                            handleShowBooks(recipe.id);
                                        }}
                                        icon={MenuBook}
                                        tooltipTitle="Add to Book"
                                        tooltipPlacement="right"
                                        variant="dark"
                                    />
                                    {(session?.user?.username === recipe.username) &&
                                        <IconButton
                                            onClick={() => setShowShareDialog(true)}
                                            icon={ShareIcon}
                                            tooltipTitle="Share Recipe"
                                            tooltipPlacement="right"
                                            variant="dark"
                                        />
                                    }
                                    <IconButton
                                        onClick={() => {
                                            if (saved) {
                                                removeSavedRecipe(recipe.id)
                                                router.refresh();
                                            } else {
                                                addSavedRecipe(recipe.id)
                                                router.refresh();
                                            }
                                        }}
                                        renderIcon={() => {
                                            return saved ? (
                                                <TurnedIn className="text-primary text-base group-hover:text-lg" />
                                            ) : (
                                                <TurnedInNot className="text-text text-base group-hover:text-lg" />
                                            )
                                        }}
                                        tooltipTitle={saved ? "Unsave Recipe" : "Save Recipe"}
                                        tooltipPlacement="right"
                                        variant="dark"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="pt-3">
                            <h3 className="font-medium text-lg truncate" title={recipe.title}>{recipe.title}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-600">By {recipe.username}</p>
                                {recipe.duration > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">{recipe.duration} minutes</p>
                                )}
                            </div>
                            <div className="mt-2 relative">
                                {recipe.categories && recipe.categories.length > 0 ? (
                                    <div className="group">
                                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                            {recipe.categories.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs px-2 py-0.5 rounded-md bg-secondary bg-opacity-10 text-text font-medium mr-1.5 inline-block"
                                                >
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </span>
                                            ))}
                                        </div>
                                        {recipe.categories.length > 2 && (
                                            <div className="absolute left-0 top-full mt-1 z-20 bg-gray-100 p-2 rounded-md shadow-lg hidden group-hover:block">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {recipe.categories.map((category, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-2 py-0.5 rounded-md bg-secondary bg-opacity-10 text-text font-medium"
                                                        >
                                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">No categories</span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
            <NewBookDialog
                open={openNewBookDialog}
                onClose={() => setOpenNewBookDialog(false)}
                createRecipeBook={handleCreateBook}
            />
            <ShareDialog
                open={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                onShare={(email, message, permission) => {
                    if (selectedRecipe) {
                        sendRecipeInvitation(selectedRecipe, email, message, permission)
                    }
                    setShowShareDialog(false)
                }}
                name={recipes?.find((recipe) => recipe.id === selectedRecipe)?.title || ''}
            />
        </div>
    )
}