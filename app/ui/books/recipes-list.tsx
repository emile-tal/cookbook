'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import { LiteRecipe } from '@/app/types/definitions';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';

interface Props {
    recipes: LiteRecipe[] | null
}

export default function RecipesList({ recipes }: Props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fullUrl = pathname + '?' + searchParams.toString();

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col">
            {recipes?.map((recipe) => (
                <div key={recipe.id} className='py-2 grid grid-cols-12 w-full'>
                    <p onClick={() => router.push(`/recipe/${recipe.id}?from=${fullUrl}`)} className="hover:cursor-pointer col-span-5">{recipe.title}</p>
                    <p className="col-span-4">{recipe.username}</p>
                    <p className="col-span-2">{recipe.duration} minutes</p>
                    <div className="col-span-1 flex gap-2 justify-end">
                        {session?.user?.username === recipe.username && <Tooltip title="Edit Recipe" placement="right">
                            <button
                                className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white hover:shadow-sm group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/recipe/${recipe.id}/edit?from=${fullUrl}`);
                                }}>
                                <EditIcon className="text-text text-base group-hover:text-lg" />
                            </button>
                        </Tooltip>}
                    </div>
                </div>
            ))}
        </div>
    )
}