'use client'

import { Book } from '@/app/types/definitions';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import EditTitle from "@/app/components/EditTitle";
import { updateBookName } from "@/app/lib/data/recipeBook";
import { useState } from "react";
interface Props {
    book: Book;
}

export default function EditBookName({ book }: Props) {
    const [name, setName] = useState(book.name);

    return (
        <div className="flex items-center gap-2">
            <EditTitle title={name} onChange={setName} />
        </div>
    )
}