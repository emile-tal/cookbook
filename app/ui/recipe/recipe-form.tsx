'use client'

import { Ingredient, Instruction, Recipe } from "@/app/types/definitions"
import { useActionState, useEffect, useRef, useState } from "react"

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Autocomplete from "@mui/material/Autocomplete";
import { BackButton } from "../buttons/back-button";
import Chip from "@mui/material/Chip";
import DeleteDialog from "@/app/components/DeleteDialog";
import EditIcon from '@mui/icons-material/Edit';
import EditTitle from '@/app/components/EditTitle'
import Image from "next/image"
import IngredientsForm from './ingredients-form'
import InstructionsForm from './instructions-form'
import PrimaryButton from "../buttons/primary-button";
import { RecipeFormState } from "@/app/actions/recipe"
import SecondaryButton from "../buttons/secondary-button";
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
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        recipe?.ingredients
            ? [...recipe.ingredients, { id: crypto.randomUUID(), position: recipe.ingredients.length + 1, amount: '', ingredient: '' }]
            : [{ id: crypto.randomUUID(), position: 1, amount: '', ingredient: '' }]
    )
    const [instructions, setInstructions] = useState<Instruction[]>(
        recipe?.instructions
            ? [...recipe.instructions, { id: crypto.randomUUID(), position: recipe.instructions.length + 1, instruction: '' }]
            : [{ id: crypto.randomUUID(), position: 1, instruction: '' }]
    )
    const [title, setTitle] = useState(recipe?.title || '')
    const [selectedCategories, setSelectedCategories] = useState<string[]>(recipe?.categories || [])
    const [imageUrl, setImageUrl] = useState<string | null>(recipe?.image_url || null)
    const [isUploading, setIsUploading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isPublic, setIsPublic] = useState(recipe?.is_public ?? true);
    const [duration, setDuration] = useState<string>(recipe?.duration?.toString() || '');
    const [recipeYield, setRecipeYield] = useState<string>(recipe?.recipe_yield?.toString() || '');

    useEffect(() => {
        setTitle(recipe?.title || '')
    }, [recipe?.title])

    useEffect(() => {
        setSelectedCategories(recipe?.categories || [])

        // Update ingredients
        if (recipe?.ingredients) {
            setIngredients([
                ...recipe.ingredients,
                { id: crypto.randomUUID(), position: recipe.ingredients.length + 1, amount: '', ingredient: '' }
            ]);
        }

        // Update instructions
        if (recipe?.instructions) {
            setInstructions([
                ...recipe.instructions,
                { id: crypto.randomUUID(), position: recipe.instructions.length + 1, instruction: '' }
            ]);
        }
    }, [recipe])

    useEffect(() => {
        if (recipe) {
            setDuration(recipe.duration?.toString() || '');
            setRecipeYield(recipe.recipe_yield?.toString() || '');
        }
    }, [recipe]);

    const formatCategories = (categories: string[]) => {
        return categories.map(category => (category.charAt(0).toUpperCase() + category.slice(1)))
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

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDuration(value);
    };

    const handleYieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRecipeYield(value);
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
        e.currentTarget.blur();
    };

    return (
        <form action={dispatch} className="max-w-screen-sm mx-auto">
            <div className="flex flex-col gap-4 relative">
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
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none"
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
                            },
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D72638',
                                    borderWidth: '1px',
                                }
                            },
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
                        min={0}
                        value={duration}
                        onChange={handleDurationChange}
                        onWheel={handleWheel}
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none"
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
                        min={0}
                        value={recipeYield}
                        onChange={handleYieldChange}
                        onWheel={handleWheel}
                        className="mt-1 block min-w-full rounded-md border border-gray-300 px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none"
                    />
                    {state?.errors?.recipe_yield && (
                        <div className="text-red-500 text-sm">{state.errors.recipe_yield}</div>
                    )}
                </div>

                <IngredientsForm
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                />

                <InstructionsForm
                    instructions={instructions}
                    setInstructions={setInstructions}
                />

                <div className="flex items-center">
                    <Switch
                        name="is_public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        color="primary"
                    />
                    <label className="text-sm font-medium ml-2">
                        Make recipe public
                    </label>
                </div>
                <div className="flex gap-2 justify-end sm:justify-between pt-8">
                    <SecondaryButton
                        text="Delete Recipe"
                        onClick={() => setOpenDeleteDialog(true)}
                    />
                    <div className="flex gap-2">
                        <SecondaryButton
                            text="Cancel"
                            onClick={() => router.back()}
                        />
                        <PrimaryButton
                            text="Save Recipe"
                            type="submit"
                        />
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