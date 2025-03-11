import { fetchBook } from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const books = await fetchBook(id);
    const book = books?.[0];

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <div>
            <main>
                <h1 className="text-2xl font-bold">{book.name}</h1>
            </main>
        </div>
    )
}