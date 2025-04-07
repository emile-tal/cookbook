import { fetchBookByBookId, fetchUserBooks } from "@/app/lib/data/recipeBook";
import { fetchRecipesByBookId, fetchRecipesByBookIdAndQuery } from "@/app/lib/data/recipes";

import BookLogger from "@/app/components/BookLogger";
import Link from "next/link";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { Suspense } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { q?: string };
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const query = searchParams.q;
    const book = await fetchBookByBookId(id);
    const bookRecipes = await fetchRecipesByBookId(id);
    const recipes = await fetchRecipesByBookIdAndQuery(id, query);
    const books = await fetchUserBooks();

    if (!book) {
        return <div>Book not found</div>;
    }

    if (!bookRecipes || bookRecipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                <MenuBookIcon className="text-gray-300 scale-[200%] min-h-16 w-16" />
                <p className="text-gray-600 text-lg mb-4 pt-4">You don't have any recipes in this book yet.</p>
                <div className="flex gap-4">
                    <Link
                        href="/recipe/add"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                    >
                        Add a recipe
                    </Link>
                    <Link
                        href="/"
                        className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                    >
                        Find recipes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main>
            <BookLogger bookId={id} />
            <h1 className="text-2xl font-bold my-4">{book.name}</h1>
            {(recipes && recipes.length > 0) ? (
                <Suspense fallback={<div>Loading recipes...</div>}>
                    <RecipesDisplay recipes={recipes} books={books} />
                </Suspense>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                    <MenuBookIcon className="text-gray-300 scale-[200%] min-h-16 w-16" />
                    <p className="text-gray-600 text-lg mb-4 pt-4">No recipes matching your search.</p>
                </div>
            )}
        </main>
    );
}