'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface BookContextMenuProps {
    position: { x: number, y: number };
    bookId: string;
    onClose: () => void;
    fullUrl: string;
    shareHandler: () => void;
    saved: boolean;
    saveHandler: (bookId: string) => void;
    editable: boolean;
    shareable: boolean;
}

const BookContextMenu = forwardRef<HTMLDivElement, BookContextMenuProps>(({ position, bookId, onClose, fullUrl, shareHandler, saved, saveHandler, editable, shareable }, ref) => {
    const router = useRouter();
    const localRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    useImperativeHandle(ref, () => localRef.current!, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (localRef.current && !localRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={localRef} className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 min-w-[160px]" style={{ left: position.x, top: position.y }}>
            <ul>
                {editable && <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => router.push(`/books/${bookId}/edit?from=${fullUrl}`)}>Edit Book</li>}
                {session && <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={shareHandler}>Share Book</li>}
                {shareable && <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => saveHandler(bookId)}>{saved ? 'Unsave Book' : 'Save Book'}</li>}
            </ul>
        </div>
    )
})

BookContextMenu.displayName = 'BookContextMenu';

export default BookContextMenu;