'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

export function BackButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';

    return (
        <IconButton
            aria-label="go back"
            size="small"
            sx={{
                color: 'var(--primary-color)',
            }}
            onClick={() => router.push(from)}
        >
            <ArrowBackIcon />
        </IconButton>
    );
} 