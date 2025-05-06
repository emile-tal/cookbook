import { fetchAllRecipesByQuery, fetchSavedRecipesByQuery } from "../lib/data/recipes/fetch";

import Loading from "../ui/loading";
import RecipesGrid from "../ui/books/recipes-grid";
import { Suspense } from "react";
import { fetchEditableBooks } from "../lib/data/recipebooks/fetch";

export default async function RecipePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const recipes = await fetchAllRecipesByQuery(q);
    const editableBooks = await fetchEditableBooks();
    const savedRecipes = await fetchSavedRecipesByQuery(q);

    return (
        <main className="container-spacing">
            <Suspense fallback={<div className="container-spacing">
                <Loading size={24} />
            </div>}>
                <RecipesGrid recipes={recipes} editableBooks={editableBooks} savedRecipes={savedRecipes?.map((recipe) => recipe.id) || []} />
            </Suspense>
        </main>
    );
}