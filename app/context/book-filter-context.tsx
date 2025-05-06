'use client'

import { createContext, useContext, useState } from 'react';

type BookFilterContextType = {
    bookFilter: "all" | "owned" | "saved" | "shared";
    setBookFilter: (bookFilter: "all" | "owned" | "saved" | "shared") => void;
};

const BookFilterContext = createContext<BookFilterContextType | undefined>(undefined);

export const BookFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookFilter, setBookFilter] = useState<"all" | "owned" | "saved" | "shared">("all");

    return (
        <BookFilterContext.Provider value={{ bookFilter, setBookFilter }}>
            {children}
        </BookFilterContext.Provider>
    )
}


export function useBookFilterContext() {
    const context = useContext(BookFilterContext);
    if (!context) {
        throw new Error('useBookFilterContext must be used within a BookFilterProvider');
    }
    return context;
} 