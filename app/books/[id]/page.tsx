import { fetchBookByBookId, fetchRecipesByBookId } from "@/app/lib/data";

import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { Suspense } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { q?: string };
};

// This ensures the page doesn't cache and always fetches fresh data
export const dynamic = 'force-dynamic';

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const query = searchParams.q;
    const book = await fetchBookByBookId(id);
    const recipes = await fetchRecipesByBookId(id, query);

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <main>
            <h1 className="text-2xl font-bold mb-4">{book.name}</h1>
            <Suspense fallback={<div>Loading recipes...</div>}>
                <RecipesDisplay recipes={recipes} />
            </Suspense>
        </main>
    );
}