'use client'

import { Ingredient, Instruction, Recipe } from "@/app/lib/definitions"
import { useActionState, useEffect, useRef, useState } from "react"

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { RecipeFormState } from "@/app/lib/action"

interface Props {
    formAction: (prevState: RecipeFormState, formData: FormData, id?: string) => Promise<RecipeFormState>
    recipe?: Recipe
}

export default function RecipeForm({ formAction, recipe }: Props) {
    const initialState: RecipeFormState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(
        (prevState: RecipeFormState, formData: FormData) =>
            formAction(prevState, formData, recipe?.id),
        initialState
    )
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || [{ amount: '', ingredient: '' }])
    const [instructions, setInstructions] = useState<Instruction[]>(
        recipe?.instructions || [{ position: 1, instruction: '' }]
    )
    const [title, setTitle] = useState(recipe?.title || '')
    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTitle(recipe?.title || '')
    }, [recipe?.title])

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.width = 'auto'
            titleRef.current.style.width = `${Math.max(titleRef.current.scrollWidth, 300)}px`
        }
    }, [title])

    const handleTitleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget
        setTitle(input.value)
        input.style.width = 'auto'
        input.style.width = `${Math.max(input.scrollWidth, 300)}px`
    }

    const addIngredient = () => {
        setIngredients([...ingredients, { amount: '', ingredient: '' }])
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const addInstruction = () => {
        const nextPosition = instructions.length + 1
        setInstructions([...instructions, { position: nextPosition, instruction: '' }])
    }

    const removeInstruction = (position: number) => {
        const updatedInstructions = instructions
            .filter(inst => inst.position !== position)
            .map((inst, idx) => ({ ...inst, position: idx + 1 }))
        setInstructions(updatedInstructions)
    }

    const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const updatedIngredients = [...ingredients]
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value }
        setIngredients(updatedIngredients)
    }

    const updateInstruction = (position: number, value: string) => {
        const updatedInstructions = instructions.map(inst =>
            inst.position === position ? { ...inst, instruction: value } : inst
        )
        setInstructions(updatedInstructions)
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
                        value={title}
                        onChange={handleTitleInput}
                        onInput={handleTitleInput}
                        placeholder="Recipe title"
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
                    <label htmlFor="ingredients" className="block text-sm font-medium mb-2">Ingredients</label>
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <span className="col-span-2">Quantity</span>
                        <span className="col-span-9">Ingredient</span>
                        <span className="col-span-1"></span>
                    </div>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                            <input
                                type="text"
                                name={`ingredient_amount_${index}`}
                                value={ingredient.amount}
                                onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                                className="block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-2"
                            />
                            <input
                                type="text"
                                name={`ingredient_name_${index}`}
                                value={ingredient.ingredient}
                                onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                                className="block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-9"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="col-span-1 text-rose-300 hover:text-rose-500 flex justify-center items-center"
                            >
                                <DeleteOutlineIcon />
                            </button>
                        </div>
                    ))}
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-11"></div>
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="col-span-1 text-gray-400 hover:text-gray-600 flex justify-center items-center h-10"
                        >
                            <AddCircleOutlineIcon />
                        </button>
                    </div>
                    <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
                </div>

                <div>
                    <label htmlFor="instructions" className="block text-sm font-medium mb-2">Instructions</label>
                    {instructions.map((instruction) => (
                        <div key={instruction.position} className="grid grid-cols-12 gap-2 items-center mb-2">
                            <div className="col-span-1 flex items-center">
                                <span>{instruction.position}.</span>
                            </div>
                            <textarea
                                name={`instruction_${instruction.position}`}
                                value={instruction.instruction}
                                onChange={(e) => updateInstruction(instruction.position, e.target.value)}
                                className="block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-10"
                            />
                            <button
                                type="button"
                                onClick={() => removeInstruction(instruction.position)}
                                className="col-span-1 text-rose-300 hover:text-rose-500 flex justify-center items-center"
                            >
                                <DeleteOutlineIcon />
                            </button>
                        </div>
                    ))}
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-11"></div>
                        <button
                            type="button"
                            onClick={addInstruction}
                            className="col-span-1 text-gray-400 hover:text-gray-600 flex justify-center items-center h-10"
                        >
                            <AddCircleOutlineIcon />
                        </button>
                    </div>
                    <input type="hidden" name="instructions" value={JSON.stringify(instructions)} />
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