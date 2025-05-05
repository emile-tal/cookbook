'use client'

import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import GridViewIcon from '@mui/icons-material/GridView';
import Image from "next/image"
import { Person } from "@mui/icons-material"
import TertiaryButton from "../buttons/tertiary-button";
import { UserPublicInfo } from "@/app/types/definitions"
import ViewListIcon from '@mui/icons-material/ViewList';
import { useBookRecipeContext } from "@/app/context/book-recipe-context";
import { useDisplayView } from "@/app/context/display-view-context";

interface ProfileHeaderProps {
    userPublicInfo: UserPublicInfo
}

export default function ProfileHeader({ userPublicInfo }: ProfileHeaderProps) {
    const { displayView, setDisplayView } = useDisplayView();
    const { bookRecipeView, setBookRecipeView } = useBookRecipeContext();

    return (
        <div className="flex items-center gap-8 py-12 px-6 max-w-screen-lg mx-auto">
            <div className="w-full max-w-2xl bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative min-w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {userPublicInfo.user_image_url ? (
                            <Image
                                src={userPublicInfo.user_image_url}
                                alt="User avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <Person className="text-gray-400 text-4xl scale-[175%]" />
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{userPublicInfo.username}</h1>
                        <div className="flex gap-12 text-gray-600">
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{userPublicInfo.book_count}</p>
                                <p className="text-sm text-gray-500">{userPublicInfo.book_count === 1 ? "Book" : "Books"}</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{userPublicInfo.recipe_count}</p>
                                <p className="text-sm text-gray-500">{userPublicInfo.recipe_count === 1 ? "Recipe" : "Recipes"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="flex gap-4 justify-center mb-6">
                    <TertiaryButton text="Books" onClick={() => setBookRecipeView("books")} />
                    <TertiaryButton text="Recipes" onClick={() => setBookRecipeView("recipes")} />
                </div>
                <ToggleButtonGroup
                    value={displayView}
                    exclusive
                    onChange={(_, newView) => setDisplayView(newView)}
                    aria-label="view toggle"
                    sx={{
                        border: 'none',
                        '& .MuiButtonBase-root': {
                            border: 'none',
                        },
                    }}
                >
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridViewIcon />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
        </div>
    )
}