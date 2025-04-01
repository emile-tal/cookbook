'use client';

import { logBookView } from '@/app/actions/logs';
import { useEffect } from 'react';

export default function BookLogger({ bookId }: { bookId: string }) {
    useEffect(() => {
        logBookView(bookId);
    }, [bookId]);

    return null;
} 