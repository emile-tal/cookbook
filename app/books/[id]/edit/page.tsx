'use server'

import EditBookName from "@/app/ui/books/edit-bookname";
import { fetchBookByBookId } from "@/app/lib/data/recipeBook";

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
        <div>
            <EditBookName book={book} />

        </div>
    )
}