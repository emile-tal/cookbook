'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../buttons/icon-button';

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
                <IconButton
                    onClick={() => router.push(`/books/${bookId}/edit?from=${pathname + '?' + searchParams.toString()}`)}
                    icon={EditIcon}
                    tooltipTitle="Edit Book"
                    tooltipPlacement="right"
                    variant="light"
                />
            )}
        </div>
    );
} 