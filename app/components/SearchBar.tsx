'use client';

import { logSearch, searchAutocomplete } from '../lib/data/logs';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/app/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
    placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
    const [input, setInput] = useState('')
    const [debouncedInput] = useDebounce(input, 1000) // 1 second debounce
    const [suggestions, setSuggestions] = useState<{ personalMatches: string[], popularMatches: string[] }>({ personalMatches: [], popularMatches: [] })
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentQuery = searchParams.get('q') || '';
    const isSubmitting = useRef(false);

    useEffect(() => {
        async function loadSuggestions() {
            if (!debouncedInput) {
                setSuggestions({ personalMatches: [], popularMatches: [] })
                return
            }

            const results = await searchAutocomplete(debouncedInput)
            setSuggestions(results)
        }

        loadSuggestions()
    }, [debouncedInput])

    const highlightMatch = (term: string) => {
        if (!debouncedInput) return term
        const regex = new RegExp(`(${debouncedInput})`, 'gi')
        return term.replace(regex, '<strong>$1</strong>')
    }

    const combinedSuggestions = [
        ...suggestions.personalMatches.map(term => ({ term, from: 'personal' })),
        ...suggestions.popularMatches
            .filter(term => !suggestions.personalMatches.includes(term))
            .map(term => ({ term, from: 'popular' }))
    ].slice(0, 10) // limit to 10 total

    const handleSearch = (formData: FormData) => {
        isSubmitting.current = true;
        const query = formData.get('q') as string;
        logSearch(query);
        const params = new URLSearchParams();
        if (query) {
            params.set('q', query);
        }
        if (pathname === '/') {
            router.push(`/search?${params.toString()}`);
        } else {
            router.push(`${pathname}?${params.toString()}`);
        }
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
                    onChange={(e) => setInput(e.target.value)}
                />
            </form>
            {combinedSuggestions.length > 0 ? (
                combinedSuggestions.map(({ term, from }) => (
                    <div
                        key={term}
                        className={`${from === 'personal' ? 'text-purple-900' : 'text-black'}`}
                        dangerouslySetInnerHTML={{ __html: highlightMatch(term) }}
                    />
                ))
            ) : (
                <div className="text-gray-500">
                    No results found
                </div>
            )}
        </div>
    );
} 