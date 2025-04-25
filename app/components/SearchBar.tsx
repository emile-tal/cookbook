'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/app/ui/input';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useRef } from 'react';

interface SearchBarProps {
    placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentQuery = searchParams.get('q') || '';
    const isSubmitting = useRef(false);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        if (isSubmitting.current) return;

        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }
        if (pathname === '/') {
            router.push(`/search?${params.toString()}`);
        } else {
            router.push(`${pathname}?${params.toString()}`);
        }
    }, 300);

    const handleSearch = (formData: FormData) => {
        isSubmitting.current = true;
        const query = formData.get('q') as string;
        const params = new URLSearchParams();
        if (query) {
            params.set('q', query);
        }
        router.push(`/search?${params.toString()}`);
        // Reset the flag after navigation
        setTimeout(() => {
            isSubmitting.current = false;
        }, 0);
    }

    return (
        <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <form action={handleSearch} className="max-w-full">
                <Input
                    name="q"
                    placeholder={placeholder}
                    className="pl-8 min-w-full max-w-full rounded-xl shadow-sm"
                    defaultValue={currentQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)}
                />
            </form>
        </div>
    );
} 