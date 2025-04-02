import { fetchBookByBookId, fetchUserBooks } from "@/app/lib/data/recipeBook";

import BookLogger from "@/app/components/BookLogger";
import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { Suspense } from "react";
import { fetchRecipesByBookId } from "@/app/lib/data/recipes";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { q?: string };
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const query = searchParams.q;
    const book = await fetchBookByBookId(id);
    const recipes = await fetchRecipesByBookId(id, query);
    const myBooks = await fetchUserBooks();

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <main>
            <BookLogger bookId={id} />
            <h1 className="text-2xl font-bold my-4">{book.name}</h1>
            <Suspense fallback={<div>Loading recipes...</div>}>
                <RecipesDisplay recipes={recipes} />
            </Suspense>
        </main>
    );
}