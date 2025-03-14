'use client'

import { Recipe } from "@/app/lib/definitions"
import { RecipeFormState } from "@/app/lib/action"
import { useActionState } from "react"

interface Props {
    formAction: (prevState: RecipeFormState, formData: FormData, id?: string) => Promise<RecipeFormState>
    recipe?: Recipe
}

export default function RecipeForm({ formAction, recipe }: Props) {
    const initialState: RecipeFormState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(formAction, initialState)


    return (
        <form action={dispatch}>
            <div className="space-y-4">
                {state?.message && (
                    <div className="text-red-500">{state.message}</div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={recipe?.title}
                        placeholder="Recipe title"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.description && (
                        <div className="text-red-500 text-sm">{state.errors.description}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium">Category</label>
                    <input
                        type="text"
                        name="category"
                        defaultValue={recipe?.category}
                        placeholder="Recipe category"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium">Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        defaultValue={recipe?.duration}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.duration && (
                        <div className="text-red-500 text-sm">{state.errors.duration}</div>
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