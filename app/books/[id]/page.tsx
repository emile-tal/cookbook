import { RecipeCards } from "@/app/ui/books/recipe-cards";
import { fetchBook } from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    const books = await fetchBook(id);
    const book = books?.[0];

    if (!book) {
        return <div>Book not found</div>;
    }

    console.log(book);

    return (
        <div>
            <main>
                <h1 className="text-2xl font-bold">{book.name}</h1>
                <div className="flex flex-wrap gap-4">
                    <RecipeCards recipes={book.recipes} />
                </div>
            </main>
        </div>
    )
}