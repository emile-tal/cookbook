import { fetchBookByBookId, fetchRecipesByBookId } from "@/app/lib/data";

import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { Suspense } from "react";

type Props = {
    params: Promise<{ id: string }>;
};

// Set revalidation of this page so it fetches fresh data
export const revalidate = 0; // This ensures the page doesn't cache and always fetches fresh data

export default async function Page({ params }: Props) {
    const { id } = await params;
    const book = await fetchBookByBookId(id);
    const recipes = await fetchRecipesByBookId(id);

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <div>
            <main>
                <h1 className="text-2xl font-bold">{book.name}</h1>
                <Suspense fallback={<div>Loading recipes...</div>}>
                    <RecipesDisplay recipes={recipes} />
                </Suspense>
            </main>
        </div>
    );
}