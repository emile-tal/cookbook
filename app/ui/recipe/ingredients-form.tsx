'use client'

import { Ingredient } from "@/app/types/definitions"
import dynamic from 'next/dynamic'

interface IngredientsFormProps {
    ingredients: Ingredient[]
    setIngredients: (ingredients: Ingredient[]) => void
}

const DynamicIngredientsForm = dynamic(() => import('./dynamic-ingredients-form'), {
    ssr: false
})

export default function IngredientsForm(props: IngredientsFormProps) {
    return <DynamicIngredientsForm {...props} />
}
