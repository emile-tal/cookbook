import { fetchBookByBookId, fetchUserBooks } from "@/app/lib/data/recipebooks/fetch";
import { fetchRecipesByBookId, fetchRecipesByBookIdAndQuery } from "@/app/lib/data/recipes/fetch";

import BookLogger from "@/app/components/BookLogger";
import EmptyBook from "@/app/ui/books/empty-book";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { Suspense } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ q?: string, from?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const { q } = await searchParams;
    const [book, bookRecipes, recipes, userBooks] = await Promise.all([
        fetchBookByBookId(id),
        fetchRecipesByBookId(id),
        fetchRecipesByBookIdAndQuery(id, q),
        fetchUserBooks()
    ]);

    if (!book) {
        return <div>Book not found</div>;
    }

    if (!bookRecipes || bookRecipes.length === 0) {
        return (
            <EmptyBook />
        );
    }

    return (
        <main>
            <BookLogger bookId={id} />
            <h1 className="text-2xl font-bold my-4">{book.name}</h1>
            {(recipes && recipes.length > 0) ? (
                <Suspense fallback={<div>Loading recipes...</div>}>
                    <RecipesDisplay recipes={recipes} userBooks={userBooks} />
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