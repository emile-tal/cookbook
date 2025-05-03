'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from './icon-button';

export function BackButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';

    return (
        <IconButton
            onClick={() => router.push(from)}
            icon={ArrowBackIcon}
            tooltipTitle="Back"
            tooltipPlacement="bottom"
            variant="subtle"
        />
    );
} 