'use client'

import { Ingredient, Instruction, Recipe } from "@/app/types/definitions"
import { useActionState, useEffect, useRef, useState } from "react"

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Autocomplete from "@mui/material/Autocomplete";
import { BackButton } from "../back-button";
import Chip from "@mui/material/Chip";
import DeleteDialog from "@/app/components/DeleteDialog";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import EditTitle from '@/app/components/EditTitle'
import Image from "next/image"
import { RecipeFormState } from "@/app/actions/recipe"
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { deleteRecipe } from "@/app/lib/data/recipes";
import { poppins } from "../fonts";
import { uploadImage } from "@/app/lib/uploadImage"
import { useRouter } from "next/navigation";

interface Props {
    formAction: (prevState: RecipeFormState, formData: FormData, id?: string) => Promise<RecipeFormState>
    recipe?: Recipe
    bookId?: string | null
    categories: string[]
}

export default function RecipeForm({ formAction, recipe, bookId, categories }: Props) {
    const initialState: RecipeFormState = { message: null, errors: {} }
    const [state, dispatch] = useActionState(
        (prevState: RecipeFormState, formData: FormData) => {
            if (bookId && !recipe?.id) {
                formData.append('bookId', bookId);
            }
            return formAction(prevState, formData, recipe?.id);
        },
        initialState
    )
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || [{ position: 1, amount: '', ingredient: '' }])
    const [instructions, setInstructions] = useState<Instruction[]>(
        recipe?.instructions || [{ position: 1, instruction: '' }]
    )
    const [title, setTitle] = useState(recipe?.title || '')
    const [selectedCategories, setSelectedCategories] = useState<string[]>(recipe?.categories || [])

    const [imageUrl, setImageUrl] = useState<string | null>(recipe?.image_url || null)
    const [isUploading, setIsUploading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    useEffect(() => {
        setTitle(recipe?.title || '')
    }, [recipe?.title])

    const formatCategories = (categories: string[]) => {
        return categories.map(category => (category.charAt(0).toUpperCase() + category.slice(1)))
    }

    const addIngredient = () => {
        setIngredients([...ingredients, { position: ingredients.length + 1, amount: '', ingredient: '' }])
    }

    const removeIngredient = (position: number) => {
        const updatedIngredients = ingredients
            .filter(ing => ing.position !== position)
            .map((ing, idx) => ({ ...ing, position: idx + 1 }))
        setIngredients(updatedIngredients)
    }

    const increasePosition = (position: number) => {
        if (position !== ingredients.length) {
            const updatedIngredients = ingredients.map((ing) =>
                ing.position === position + 1 ? { ...ing, position: ing.position - 1 } :
                    ing.position === position ? { ...ing, position: ing.position + 1 } : ing
            )
            setIngredients(updatedIngredients)
        }
    }

    const decreasePosition = (position: number) => {
        if (position !== 1) {
            const updatedIngredients = ingredients.map((ing) =>
                ing.position === position - 1 ? { ...ing, position: ing.position + 1 } :
                    ing.position === position ? { ...ing, position: ing.position - 1 } : ing
            )
            setIngredients(updatedIngredients)
        }
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

    const updateIngredient = (position: number, ingredient: string, amount: string) => {
        const updatedIngredients = ingredients.map((ing) =>
            ing.position === position ? { ...ing, ingredient, amount } : ing
        )
        setIngredients(updatedIngredients)
    }

    const updateInstruction = (position: number, instruction: string) => {
        const updatedInstructions = instructions.map(inst =>
            inst.position === position ? { ...inst, instruction } : inst
        )
        setInstructions(updatedInstructions)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const url = await uploadImage(file)
            setImageUrl(url)
        } catch (error) {
            console.error('Failed to upload image:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleDelete = async (recipeId: string) => {
        await deleteRecipe(recipeId)
        router.back()
        router.refresh()
    }

    return (
        <form action={dispatch}>
            <div className="space-y-4 relative">
                {state?.message && (
                    <div className="text-red-500">{state.message}</div>
                )}
                <div className="flex gap-2 items-center">
                    <div className="md:absolute md:top-[6.25px] md:left-[-40px]">
                        <BackButton />
                    </div>
                    <EditTitle
                        title={title}
                        onChange={setTitle}
                        error={state?.errors?.title?.[0]}
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="image" className="block text-sm font-medium mb-2">Recipe Image</label>
                    <div className="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="hidden"
                        />
                        {imageUrl ? (
                            <div
                                className="relative w-full h-64 cursor-pointer group"
                                onClick={handleImageClick}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt="Recipe preview"
                                    fill
                                    className={`object-cover rounded-lg transition-opacity duration-200 ${isHovering ? 'opacity-75' : 'opacity-100'
                                        }`}
                                />
                                {isHovering && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <EditIcon className="text-white text-4xl" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors duration-200"
                                onClick={handleImageClick}
                            >
                                <AddAPhotoIcon className="text-gray-400 text-4xl mb-2" />
                                <p className="text-gray-500">Click to upload recipe image</p>
                            </div>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                <p className="text-white">Uploading image...</p>
                            </div>
                        )}
                    </div>
                    <input type="hidden" name="image_url" value={imageUrl || ''} />
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
                    <label htmlFor="category" className="block text-sm font-medium mb-2">Categories</label>
                    <Autocomplete
                        multiple
                        id="categories"
                        options={formatCategories(categories)}
                        value={selectedCategories}
                        onChange={(_, newValue) => setSelectedCategories(newValue)}
                        freeSolo
                        className="bg-white"
                        sx={{
                            '& .MuiChip-root': {
                                margin: '0 4px 4px 0',
                            }
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const capitalizedOption = option.charAt(0).toUpperCase() + option.slice(1);
                                return (
                                    <Chip
                                        label={capitalizedOption}
                                        {...getTagProps({ index })}
                                        key={option}
                                        className={`bg-secondary bg-opacity-10 text-secondary ${poppins.className}`}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Add categories"
                                variant="outlined"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <input
                        type="hidden"
                        name="categories"
                        value={JSON.stringify(selectedCategories)}
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium">Cook time (minutes)</label>
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
                    <label htmlFor="recipe_yield" className="block text-sm font-medium">Yield (servings)</label>
                    <input
                        type="number"
                        name="recipe_yield"
                        defaultValue={recipe?.recipe_yield}
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {state?.errors?.recipe_yield && (
                        <div className="text-red-500 text-sm">{state.errors.recipe_yield}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="ingredients" className="hidden">Ingredients</label>
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <span className="col-span-2 text-sm">Quantity</span>
                        <span className="col-span-9 text-sm">Ingredient</span>
                        <span className="col-span-1"></span>
                    </div>
                    {ingredients.sort((a, b) => a.position - b.position).map((ingredient, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2 relative">

                            <button
                                type="button"
                                onClick={() => decreasePosition(ingredient.position)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200 flex justify-center items-center absolute top-1/2 -translate-y-1/2 left-[-5rem]"
                                aria-label="Move ingredient up"
                            >
                                <ArrowDropUpIcon fontSize="large" />
                            </button>
                            <button
                                type="button"
                                onClick={() => increasePosition(ingredient.position)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200 flex justify-center items-center absolute top-1/2 -translate-y-1/2 left-[-3rem]"
                                aria-label="Move ingredient down"
                            >
                                <ArrowDropDownIcon fontSize="large" />
                            </button>

                            <input
                                type="text"
                                name={`ingredient_amount_${index}`}
                                value={ingredient.amount}
                                onChange={(e) => updateIngredient(ingredient.position, ingredient.ingredient, e.target.value)}
                                className="block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-2"
                            />
                            <input
                                type="text"
                                name={`ingredient_name_${index}`}
                                value={ingredient.ingredient}
                                onChange={(e) => updateIngredient(ingredient.position, e.target.value, ingredient.amount)}
                                className="block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-9"
                            />
                            <div className="col-span-1 flex justify-center items-center">
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="text-rose-300 hover:text-rose-500 flex justify-center items-center"
                                >
                                    <DeleteOutlineIcon />
                                </button>
                            </div>
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
                    <div className="flex items-center">
                        <Switch
                            name="is_public"
                            defaultChecked={recipe?.is_public ?? true}
                            color="primary"
                        />
                        <label className="text-sm font-medium ml-2">
                            Make recipe public
                        </label>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                        onClick={() => setOpenDeleteDialog(true)}
                    >
                        Delete Recipe
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                        >
                            Save Recipe
                        </button>
                    </div>
                </div>
            </div>
            <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onDelete={() => {
                    if (recipe?.id) {
                        handleDelete(recipe.id)
                    } else {
                        router.back()
                    }
                }}
                itemName="Recipe"
            />
        </form>
    )
}