import { fetchAllBooksByQuery, fetchEditableBooks, fetchSavedBooks } from "../lib/data/recipebooks/fetch";

import BooksGrid from "../ui/books/books-grid";
import Loading from "../ui/loading";
import { Suspense } from "react";

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;

    const books = await fetchAllBooksByQuery(q);
    const savedBooks = await fetchSavedBooks(q);
    const editableBooks = await fetchEditableBooks();

    return (
        <main className="container-spacing">
            <Suspense fallback={<div className="container-spacing">
                <Loading size={24} />
            </div>}>
                <BooksGrid books={books} savedBooks={savedBooks?.map((book) => book.id) || []} editableBooks={editableBooks?.map((book) => book.id) || []} />
            </Suspense>
        </main>
    );
}