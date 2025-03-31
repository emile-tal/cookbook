'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

export function BackButton() {
    const router = useRouter();

    return (
        <IconButton
            aria-label="go back"
            size="small"
            sx={{
                color: 'var(--primary-color)',
            }}
            onClick={() => router.back()}
        >
            <ArrowBackIcon />
        </IconButton>
    );
} 