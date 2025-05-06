'use server'

import { fetchBookByBookId, fetchEditableBooks } from "@/app/lib/data/recipebooks/fetch";
import { fetchEditableRecipes, fetchRecipesByBookId, fetchRecipesByBookIdAndQuery } from "@/app/lib/data/recipes/fetch";

import BookHeader from "@/app/ui/books/book-header";
import BookLogger from "@/app/components/BookLogger";
import EmptyBook from "@/app/ui/books/empty-book";
import Loading from "@/app/ui/loading";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { RecipesDisplay } from "@/app/ui/recipe/recipes-display";
import { Suspense } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ q?: string, from?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const { q } = await searchParams;

    const [book, bookRecipes, recipes, editableBooks, editableRecipes] = await Promise.all([
        fetchBookByBookId(id),
        fetchRecipesByBookId(id),
        fetchRecipesByBookIdAndQuery(id, q),
        fetchEditableBooks(),
        fetchEditableRecipes(),
    ]);

    if (!book) {
        return <div>Book not found</div>;
    }

    if (!bookRecipes || bookRecipes.length === 0) {
        return (
            <>
                <BookLogger bookId={id} />
                <EmptyBook bookName={book.name} canEdit={editableBooks?.map((book) => book.id).includes(id) || false} />
            </>
        );
    }

    return (
        <main>
            <BookLogger bookId={id} />
            <BookHeader bookName={book.name} bookId={id} canEdit={editableBooks?.map((book) => book.id).includes(id) || false} />
            {(recipes && recipes.length > 0) ? (
                <Suspense fallback={<div className="container-spacing">
                    <Loading size={24} />
                </div>}>
                    <RecipesDisplay recipes={recipes} editableBooks={editableBooks} editableRecipes={editableRecipes?.map((recipe) => recipe.id) || []} />
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