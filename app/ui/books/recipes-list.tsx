'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../buttons/icon-button';
import { LiteRecipe } from '@/app/types/definitions';
import RecipeContextMenu from '@/app/components/RecipeContextMenu';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface Props {
    recipes: LiteRecipe[] | null
}

export default function RecipesList({ recipes }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [menuVisible, setMenuVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

    const handleContextMenu = (e: React.MouseEvent, recipeId: string) => {
        e.preventDefault();
        setSelectedRecipe(recipeId);
        setPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible(true);
    };

    const fullUrl = pathname + '?' + searchParams.toString();

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col">
            {recipes?.map((recipe) => (
                <div
                    key={recipe.id}
                    className='py-2 grid grid-cols-12 w-full'
                    onClick={() => router.push(`/recipe/${recipe.id}?from=${fullUrl}`)}
                    onContextMenu={(e) => handleContextMenu(e, recipe.id)}
                >
                    <p className="hover:cursor-pointer col-span-5 truncate text-sm md:text-base" title={recipe.title}>{recipe.title}</p>
                    <p className="col-span-4 text-sm md:text-base truncate">{recipe.username}</p>
                    <p className="col-span-2 hidden md:block text-base">{recipe.duration} minutes</p>
                    <p className="col-span-3 text-sm md:hidden">{recipe.duration} mins</p>
                    <div className="col-span-1 gap-2 justify-end hidden md:flex">
                        {session?.user?.username === recipe.username && <IconButton
                            onClick={() => router.push(`/recipe/${recipe.id}/edit?from=${fullUrl}`)}
                            tooltipTitle="Edit Recipe"
                            tooltipPlacement="right"
                            variant="light"
                            icon={EditIcon}
                        />}
                    </div>
                </div>
            ))}
            {menuVisible && selectedRecipe && <RecipeContextMenu position={position} recipeId={selectedRecipe} onClose={() => setMenuVisible(false)} fullUrl={fullUrl} />}
        </div>
    )
}