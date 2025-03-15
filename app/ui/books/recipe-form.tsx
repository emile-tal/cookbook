'use client'

import { Ingredient, Instruction, Recipe } from "@/app/lib/definitions"
import { useActionState, useEffect, useRef, useState } from "react"

import { RecipeFormState } from "@/app/lib/action"

interface Props {
    formAction: (prevState: RecipeFormState, formData: FormData, id?: string) => Promise<RecipeFormState>
    recipe?: Recipe
}

export default function RecipeForm({ formAction, recipe }: Props) {
    const initialState: RecipeFormState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(formAction, initialState)
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || [])
    const [instructions, setInstructions] = useState<Instruction[]>(recipe?.instructions || [])
    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.width = 'auto'
            titleRef.current.style.width = `${Math.max(titleRef.current.scrollWidth, 300)}px`
        }
    }, [])

    const handleTitleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget
        input.style.width = 'auto'
        input.style.width = `${Math.max(input.scrollWidth, 300)}px`
    }

    return (
        <form action={dispatch}>
            <div className="space-y-4">
                {state?.message && (
                    <div className="text-red-500">{state.message}</div>
                )}

                <div className="w-full">
                    <label htmlFor="title" className="hidden">Title</label>
                    <input
                        ref={titleRef}
                        type="text"
                        name="title"
                        defaultValue={recipe?.title}
                        placeholder="Recipe title"
                        onInput={handleTitleInput}
                        className="text-2xl px-3 py-2 bg-background focus:outline-none focus:border-b-2 focus:border-secondary"
                        style={{ minWidth: '300px' }}
                    />
                    {state?.errors?.title && (
                        <div className="text-red-500 text-sm">{state.errors.title}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={recipe?.description}
                        placeholder="Recipe description"
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.description && (
                        <div className="text-red-500 text-sm">{state.errors.description}</div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        <input
                            type="checkbox"
                            name="is_public"
                            defaultChecked={recipe?.is_public ?? true}
                            className="mr-2"
                        />
                        Make recipe public
                    </label>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium">Category</label>
                    <input
                        type="text"
                        name="category"
                        defaultValue={recipe?.category}
                        placeholder="Recipe category"
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium">Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        defaultValue={recipe?.duration}
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.duration && (
                        <div className="text-red-500 text-sm">{state.errors.duration}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="ingredients" className="block text-sm font-medium">Ingredients</label>
                    <div className="grid grid-cols-8 gap-2">
                        <span className="col-span-1">Quantity</span>
                        <span className="col-span-7">Ingredient</span>
                    </div>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="grid grid-cols-8 gap-2">
                            <input
                                type="text"
                                name="ingredients"
                                defaultValue={ingredient.amount}
                                className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-1"
                            />
                            <input
                                type="text"
                                name="ingredients"
                                defaultValue={ingredient.ingredient}
                                className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-7"
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label htmlFor="instructions" className="block text-sm font-medium">Instructions</label>
                    {instructions.sort((a, b) => a.position - b.position).map((instruction) => (
                        <div key={instruction.position} className="grid grid-cols-12 gap-2">
                            <div className="col-span-1 flex items-center">
                                <span>{instruction.position}.</span>
                            </div>
                            <textarea
                                name="instructions"
                                defaultValue={instruction.instruction}
                                className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-11"
                            />
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                    Save Recipe
                </button>
            </div>
        </form>
    )
}