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
            <ImportRecipe onRecipeImported={(recipe) => { setImportedRecipe(recipe) }} />
            <RecipeForm
                formAction={formAction}
                bookId={bookId}
                categories={categories}
                recipe={importedRecipe}
            />
        </>
    );
} 