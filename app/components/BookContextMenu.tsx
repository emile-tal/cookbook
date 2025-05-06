'use client'

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

interface BookContextMenuProps {
    position: { x: number, y: number };
    bookId: string;
    onClose: () => void;
    fullUrl: string;
    shareHandler: () => void;
    saved: boolean;
    saveHandler: (bookId: string) => void;
}

export default function BookContextMenu({ position, bookId, onClose, fullUrl, shareHandler, saved, saveHandler }: BookContextMenuProps) {
    const router = useRouter();

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={menuRef} className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 min-w-[160px]" style={{ left: position.x, top: position.y }}>
            <ul>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => router.push(`/books/${bookId}/edit?from=${fullUrl}`)}>Edit Book</li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={shareHandler}>Share Book</li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => saveHandler(bookId)}>{saved ? 'Unsave Book' : 'Save Book'}</li>
            </ul>
        </div>
    )
}