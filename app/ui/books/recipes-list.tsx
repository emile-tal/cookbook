'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../buttons/icon-button';
import { LiteRecipe } from '@/app/types/definitions';
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
        </div>
    )
}