'use client'

import { createContext, useContext, useState } from 'react';

type RecipeFilterContextType = {
    recipeFilter: "all" | "owned" | "saved" | "shared";
    setRecipeFilter: (recipeFilter: "all" | "owned" | "saved" | "shared") => void;
};

const RecipeFilterContext = createContext<RecipeFilterContextType | undefined>(undefined);

export const RecipeFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [recipeFilter, setRecipeFilter] = useState<"all" | "owned" | "saved" | "shared">("all");

    return (
        <RecipeFilterContext.Provider value={{ recipeFilter, setRecipeFilter }}>
            {children}
        </RecipeFilterContext.Provider>
    )
}


export function useRecipeFilterContext() {
    const context = useContext(RecipeFilterContext);
    if (!context) {
        throw new Error('useRecipeFilterContext must be used within a RecipeFilterProvider');
    }
    return context;
} 