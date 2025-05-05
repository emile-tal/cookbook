'use client'

import { createContext, useContext, useState } from 'react';

type BookRecipeContextType = {
    bookRecipeView: "books" | "recipes";
    setBookRecipeView: (bookRecipeView: "books" | "recipes") => void;
};

const BookRecipeContext = createContext<BookRecipeContextType | undefined>(undefined);

export const BookRecipeProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookRecipeView, setBookRecipeView] = useState<"books" | "recipes">("books");

    return (
        <BookRecipeContext.Provider value={{ bookRecipeView, setBookRecipeView }}>
            {children}
        </BookRecipeContext.Provider>
    )
}


export function useBookRecipeContext() {
    const context = useContext(BookRecipeContext);
    if (!context) {
        throw new Error('useBookRecipeContext must be used within a BookRecipeProvider');
    }
    return context;
} 