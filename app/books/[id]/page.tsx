import { fetchBookByBookId, fetchRecipesByBookId } from "@/app/lib/data";

import { RecipeCards } from "@/app/ui/books/recipe-cards";

type Props = {
    params: Promise<{ id: string }>;
};

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
                <RecipeCards recipes={recipes} />
            </main>
        </div>
    )
}