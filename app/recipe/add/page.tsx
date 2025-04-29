import RecipeImportWrapper from "@/app/ui/recipe/recipe-import-wrapper";
import { fetchCategories } from "@/app/lib/data/categories";
import { recipeAction } from "@/app/actions/recipe";

// Server component using searchParams prop
export default async function AddRecipePage({ searchParams }: { searchParams: Promise<{ bookId?: string }> }) {
    const { bookId } = await searchParams;
    const categories = await fetchCategories();

    return (
        <main className="container-spacing mb-8">
            <div className="max-w-2xl mx-auto">
                <RecipeImportWrapper
                    formAction={recipeAction}
                    bookId={bookId}
                    categories={categories}
                />
            </div>
        </main>
    );
}
