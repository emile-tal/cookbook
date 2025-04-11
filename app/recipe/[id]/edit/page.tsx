'use server'

import RecipeForm from "@/app/ui/recipe/recipe-form";
import { fetchCategories } from "@/app/lib/data/categories";
import { fetchRecipeById } from "@/app/lib/data/recipes/fetch";
import { recipeAction } from "@/app/actions/recipe";
interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
    const { id } = await params;
    const recipe = await fetchRecipeById(id);
    const categories = await fetchCategories();

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <main className="container-spacing">
            <div className="max-w-2xl mx-auto">
                <RecipeForm formAction={recipeAction} recipe={recipe} categories={categories} />
            </div>
        </main>
    );
}