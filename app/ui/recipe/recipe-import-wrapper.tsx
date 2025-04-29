'use client'

import ImportRecipe from "./import-recipe";
import RecipeForm from "./recipe-form";
import { RecipeFormState } from "@/app/actions/recipe";
import { useState } from "react";

interface RecipeImportWrapperProps {
    formAction: (prevState: RecipeFormState, formData: FormData, id?: string) => Promise<RecipeFormState>;
    bookId?: string | null;
    categories: string[];
}

export default function RecipeImportWrapper({ formAction, bookId, categories }: RecipeImportWrapperProps) {
    const [importedRecipe, setImportedRecipe] = useState<any>(null);

    return (
        <>
            <ImportRecipe onRecipeImported={(recipe) => {
                setImportedRecipe(recipe);
                // TODO: When recipe parsing is implemented, we'll populate the form with the parsed data
            }} />
            <RecipeForm
                formAction={formAction}
                bookId={bookId}
                categories={categories}
            // TODO: Add imported recipe data to the form when parsing is implemented
            />
        </>
    );
} 