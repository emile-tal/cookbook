'use server'

import RecipeForm from "@/app/ui/recipe/recipe-form";
import { fetchRecipeById } from "@/app/lib/data/recipes";
import { recipeAction } from "@/app/actions/recipe";

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
                <RecipeForm formAction={recipeAction} recipe={recipe} />
            </div>
        </main>
    );
}