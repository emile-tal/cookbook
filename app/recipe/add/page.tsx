'use client'

import RecipeForm from "@/app/ui/books/recipe-form";
import { recipeAction } from "@/app/lib/action";

export default function AddRecipePage() {
    return (
        <main className="container-spacing py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Add New Recipe</h1>
                <RecipeForm formAction={recipeAction} />
            </div>
        </main>
    );
}