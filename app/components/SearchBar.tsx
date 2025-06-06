'use client';

import { logSearch, searchAutocomplete } from '../lib/data/logs';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Input } from '@/app/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
    placeholder?: string;
}

export function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
    const [typedInput, setTypedInput] = useState('');
    const [input, setInput] = useState('');
    const [debouncedInput] = useDebounce(typedInput, 800);
    const [suggestions, setSuggestions] = useState<{ personalMatches: string[], popularMatches: string[] }>({ personalMatches: [], popularMatches: [] });
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadSuggestions() {
            if (!debouncedInput) {
                setSuggestions({ personalMatches: [], popularMatches: [] });
                return;
            }
            const results = await searchAutocomplete(debouncedInput);
            setSuggestions({
                personalMatches: deduplicate(results.personalMatches),
                popularMatches: deduplicate(results.popularMatches),
            });
        }
        loadSuggestions();
    }, [debouncedInput]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((inputRef.current && !inputRef.current.contains(event.target as Node)) ||
                (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node))) {
                setTimeout(() => {
                    setShowSuggestions(false);
                }, 100);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const combinedSuggestions = [
        ...suggestions.personalMatches.map(term => ({ term, from: 'personal' })),
        ...suggestions.popularMatches
            .filter(term => !suggestions.personalMatches.includes(term))
            .map(term => ({ term, from: 'popular' }))
    ].slice(0, 10);

    function deduplicate(array: string[]) {
        return Array.from(new Set(array));
    }

    const highlightMatch = (term: string) => {
        if (!typedInput) return term;
        const regex = new RegExp(`(${typedInput})`, 'gi');
        return term.replace(regex, '<strong>$1</strong>');
    };

    const handleSearch = (query: string) => {
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
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab'].includes(e.key)) {
            e.preventDefault();
        }

        const totalSuggestions = combinedSuggestions.length;

        switch (e.key) {
            case 'ArrowDown':
                if (totalSuggestions === 0) return;
                setSelectedIndex(prev => {
                    if (prev === totalSuggestions - 1) {
                        return -1;
                    } else if (prev === -1) {
                        return 0;
                    } else {
                        return prev + 1;
                    }
                });
                break;
            case 'ArrowUp':
                if (totalSuggestions === 0) return;
                setSelectedIndex(prev => {
                    if (prev === 0) {
                        return -1;
                    } else if (prev === -1) {
                        return totalSuggestions - 1;
                    } else {
                        return prev - 1;
                    }
                });
                break;
            case 'Enter':
                if (selectedIndex !== -1) {
                    const selectedTerm = combinedSuggestions[selectedIndex].term;
                    setInput(selectedTerm);
                    setTypedInput(selectedTerm);
                    handleSearch(selectedTerm);
                } else {
                    handleSearch(input);
                }
                break;
            case 'Tab':
                if (selectedIndex >= 0) {
                    const selectedTerm = combinedSuggestions[selectedIndex].term;
                    setInput(selectedTerm);
                    setTypedInput(selectedTerm);
                }
                break;
        }
    };

    const handleSuggestionClick = (term: string) => {
        setInput(term);
        setTypedInput(term);
        handleSearch(term);
    };

    return (
        <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <div className="max-w-full">
                <Input
                    ref={inputRef}
                    name="q"
                    placeholder={placeholder}
                    className="pl-8 min-w-full max-w-full rounded-xl shadow-sm"
                    value={input}
                    onChange={(e) => {
                        setTypedInput(e.target.value);
                        setInput(e.target.value);
                        setSelectedIndex(-1);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {combinedSuggestions.length > 0 && showSuggestions && (
                <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-full">
                    {combinedSuggestions.map(({ term, from }, index) => (
                        <div
                            key={index}
                            tabIndex={-1}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-base ${from === 'personal' ? 'text-purple-900' : 'text-gray-900'
                                } ${index === selectedIndex ? 'bg-gray-200 font-semibold' : ''}`}
                            dangerouslySetInnerHTML={{ __html: highlightMatch(term) }}
                            onMouseDown={() => handleSuggestionClick(term)}
                        />
                    ))}
                </div>
            )}

            {debouncedInput && combinedSuggestions.length === 0 && showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2 text-gray-500 min-w-full">
                    No results found
                </div>
            )}
        </div>
    );
}
