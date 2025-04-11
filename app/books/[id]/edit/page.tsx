'use server'

import BookForm from "@/app/ui/books/book-form";
import { fetchBookByBookId } from "@/app/lib/data/recipebooks/fetch";
import { updateBook } from "@/app/actions/recipebook";
interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: Props) {
    const { id } = await params;
    const book = await fetchBookByBookId(id as string);

    if (!book) {
        return <div>Book not found</div>
    }

    return (
        <div className="max-w-2xl mx-auto">
            <BookForm book={book} formAction={updateBook} />

        </div>
    )
}