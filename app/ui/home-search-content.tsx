import RecipesGrid from "./books/recipes-grid"
import { fetchAllRecipesByQuery } from "../lib/data/recipes/fetch"
import { fetchEditableBooks } from "../lib/data/recipebooks/fetch"

export default async function SearchResultsContent({ q }: { q?: string }) {
    const [allRecipes, editableBooks] = await Promise.all([
        fetchAllRecipesByQuery(q),
        fetchEditableBooks()
    ])

    return (
        <div className="flex flex-col gap-4 py-4">
            <h2 className="text-xl font-bold">Search Results</h2>
            <RecipesGrid recipes={allRecipes} editableBooks={editableBooks} />
        </div>
    )
}