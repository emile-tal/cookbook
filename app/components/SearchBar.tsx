'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/app/ui/input';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
    placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentQuery = searchParams.get('q') || '';

    const debouncedSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }
        router.push(`?${params.toString()}`);
    }, 300);

    return (
        <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                className="pl-8 min-w-full rounded-xl focus:ring-0 focus:outline-none shadow-sm"
                defaultValue={currentQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)}
            />
        </div>
    );
} 