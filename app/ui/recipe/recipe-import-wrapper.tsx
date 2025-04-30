'use client'

import ImportRecipe from "./import-recipe";
import { Recipe } from "@/app/types/definitions";
import RecipeForm from "./recipe-form";
import { RecipeFormState } from "@/app/actions/recipe";
import { useState } from "react";

interface RecipeImportWrapperProps {
    formAction: (prevState: RecipeFormState, formData: FormData, id?: string) => Promise<RecipeFormState>;
    bookId?: string | null;
    categories: string[];
}

export default function RecipeImportWrapper({ formAction, bookId, categories }: RecipeImportWrapperProps) {
    const [importedRecipe, setImportedRecipe] = useState<Recipe | undefined>(undefined);

    return (
        <>
            <ImportRecipe onRecipeImported={(recipe) => {
                // Convert the imported recipe data to match the Recipe type
                const formattedRecipe: Recipe = {
                    id: '',
                    title: recipe.title || '',
                    description: recipe.description || '',
                    ingredients: recipe.ingredients?.map((ing: any, index: number) => ({
                        id: crypto.randomUUID(),
                        position: index + 1,
                        amount: ing.amount || '',
                        ingredient: ing.ingredient || ''
                    })) || [],
                    instructions: recipe.instructions?.map((inst: any, index: number) => ({
                        id: crypto.randomUUID(),
                        position: index + 1,
                        instruction: inst.instruction || ''
                    })) || [],
                    categories: recipe.categories || [],
                    duration: recipe.duration || 0,
                    recipe_yield: recipe.recipe_yield || 0,
                    image_url: recipe.image_url || null,
                    username: '', // This will be set by the server
                    is_public: false,
                    average_rating: {
                        average_rating: 0,
                        num_ratings: 0
                    }
                };
                setImportedRecipe(formattedRecipe);
            }} />
            <RecipeForm
                formAction={formAction}
                bookId={bookId}
                categories={categories}
                recipe={importedRecipe}
            />
        </>
    );
} 