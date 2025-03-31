'use client'

import EditIcon from '@mui/icons-material/Edit';
import { LiteRecipe } from '@/app/types/definitions';
import { useRouter } from 'next/navigation';

interface Props {
    recipes: LiteRecipe[] | null
}

export default function RecipesList({ recipes }: Props) {
    const router = useRouter();

    return (
        <div className="flex flex-col">
            {recipes?.map((recipe) => (
                <div key={recipe.id} className='py-2 grid grid-cols-12 w-full'>
                    <p onClick={() => router.push(`/recipe/${recipe.id}`)} className="hover:cursor-pointer col-span-4">{recipe.title}</p>
                    <p className="col-span-3">{recipe.username}</p>
                    <p className="col-span-2">{recipe.category}</p>
                    <p className="col-span-2">{recipe.duration} minutes</p>
                    <div className="col-span-1 flex gap-2 justify-end">
                        <EditIcon onClick={() => router.push(`/recipe/${recipe.id}/edit`)} className="hover:cursor-pointer" />
                    </div>
                </div>
            ))}
        </div>
    )
}