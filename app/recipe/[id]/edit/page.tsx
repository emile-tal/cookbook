'use server'

import RecipeForm from "@/app/ui/books/recipe-form";
import { fetchRecipeById } from "@/app/lib/data";
import { recipeAction } from "@/app/lib/action";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
    const { id } = await params;
    const recipe = await fetchRecipeById(id);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <main className="container-spacing py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
                <RecipeForm formAction={recipeAction} recipe={recipe} />
            </div>
        </main>
    );
}