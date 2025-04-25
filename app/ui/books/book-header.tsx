'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';

interface Props {
    bookName: string;
    bookId: string;
    canEdit: boolean;
}

export default function BookHeader({ bookName, bookId, canEdit }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold my-4">{bookName}</h1>
            {canEdit && (
                <Tooltip title="Edit Book" placement="right">
                    <button
                        onClick={() => router.push(`/books/${bookId}/edit?from=${pathname + '?' + searchParams.toString()}`)}
                        className="flex items-center justify-center rounded-full h-8 min-w-8 hover:cursor-pointer hover:bg-white hover:shadow-sm group">
                        <EditIcon className="text-text text-base group-hover:text-lg" />
                    </button>
                </Tooltip>
            )}
        </div>
    );
} 