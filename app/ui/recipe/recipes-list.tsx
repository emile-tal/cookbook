'use client'

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../buttons/icon-button';
import { LiteRecipe } from '@/app/types/definitions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RecipeContextMenu from '@/app/components/RecipeContextMenu';
import ShareDialog from '@/app/components/ShareDialog';
import ShareIcon from '@mui/icons-material/Share';
import { TurnedIn } from '@mui/icons-material';
import { TurnedInNot } from '@mui/icons-material';
import { addSavedRecipe } from '@/app/lib/data/recipes';
import { removeSavedRecipe } from '@/app/lib/data/recipes';
import { sendRecipeInvitation } from '@/app/lib/data/recipeinvitations';
import { useSession } from 'next-auth/react';

interface Props {
    recipes: LiteRecipe[] | null,
    savedRecipes?: string[],
    editableRecipes: string[]
}

export default function RecipesList({ recipes, savedRecipes = [], editableRecipes }: Props) {
    const router = useRouter();
    const { data: session } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [rawClick, setRawClick] = useState<{ x: number, y: number } | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null)

    const handleContextMenu = (e: React.MouseEvent, recipeId: string) => {
        e.preventDefault();
        setSelectedRecipe(recipeId);
        setRawClick({ x: e.clientX, y: e.clientY });
        setMenuVisible(true);
    };

    useEffect(() => {
        if (menuVisible && rawClick && menuRef.current) {
            const menuW = menuRef.current.offsetWidth;
            const menuH = menuRef.current.offsetHeight;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            const adjustedX = rawClick.x + menuW > screenW ? screenW - menuW : rawClick.x;
            const adjustedY = rawClick.y + menuH > screenH ? screenH - menuH : rawClick.y;

            setPosition({ x: adjustedX, y: adjustedY });
        }
    }, [menuVisible, rawClick]);

    const fullUrl = pathname + '?' + searchParams.toString();

    const handleSave = (recipeId: string) => {
        if (savedRecipes.includes(recipeId)) {
            removeSavedRecipe(recipeId);
        } else {
            addSavedRecipe(recipeId);
        }
        router.refresh();
    }

    return (
        <div className="flex flex-col">
            {recipes?.map((recipe) => (
                <div
                    key={recipe.id}
                    className={`py-3 px-2 gap-2 grid grid-cols-12 w-full border-b border-gray-100 items-center hover:cursor-pointer hover:bg-gray-50 ${menuVisible && selectedRecipe === recipe.id ? "bg-gray-100" : ""}`}
                    onClick={() => router.push(`/recipe/${recipe.id}?from=${fullUrl}`)}
                    onContextMenu={(e) => handleContextMenu(e, recipe.id)}
                >
                    <p className="hover:cursor-pointer col-span-5 truncate text-sm md:text-base" title={recipe.title}>{recipe.title}</p>
                    <p className="col-span-3 text-sm md:text-base truncate">{recipe.username}</p>
                    <p className="col-span-3 hidden md:block text-base">{recipe.duration} minutes</p>
                    <p className="col-span-3 text-sm md:hidden">{recipe.duration} mins</p>
                    <div className="col-span-1 gap-2 justify-end hidden lg:flex">
                        {editableRecipes.includes(recipe.id) &&
                            <IconButton
                                onClick={() => router.push(`/recipe/${recipe.id}/edit?from=${fullUrl}`)}
                                tooltipTitle="Edit Recipe"
                                tooltipPlacement="right"
                                variant="light"
                                icon={EditIcon}
                            />
                        }
                        {session?.user?.username === recipe.username && <IconButton
                            onClick={() => setShowShareDialog(true)}
                            icon={ShareIcon}
                            tooltipTitle="Share Recipe"
                            tooltipPlacement="right"
                            variant="light"
                        />
                        }
                        {session && <IconButton
                            onClick={() => handleSave(recipe.id)}
                            renderIcon={() => {
                                return savedRecipes.includes(recipe.id) ? (
                                    <TurnedIn className="text-primary text-base group-hover:text-lg" />
                                ) : (
                                    <TurnedInNot className="text-text text-base group-hover:text-lg" />
                                )
                            }}
                            tooltipTitle={savedRecipes.includes(recipe.id) ? "Unsave Recipe" : "Save Recipe"}
                            tooltipPlacement="right"
                            variant="light"
                        />}
                    </div>
                    <div className="col-span-1 justify-end gap-2 hidden sm:flex lg:hidden">
                        <IconButton
                            onClick={(e) => handleContextMenu(e, recipe.id)}
                            icon={MoreVertIcon}
                            tooltipTitle="Options"
                            tooltipPlacement="top"
                            variant="light"
                        />
                    </div>
                </div>
            ))}
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
            {menuVisible && selectedRecipe &&
                <RecipeContextMenu
                    ref={menuRef}
                    position={position}
                    recipeId={selectedRecipe}
                    onClose={() => setMenuVisible(false)}
                    fullUrl={fullUrl}
                    saved={savedRecipes.includes(selectedRecipe)}
                    editable={editableRecipes.includes(selectedRecipe)}
                    shareable={session?.user?.username === recipes?.find((recipe) => recipe.id === selectedRecipe)?.username}
                    handleSave={handleSave}
                    shareHandler={() => {
                        if (selectedRecipe) {
                            setShowShareDialog(true);
                        }
                    }}
                />}
        </div>
    )
}