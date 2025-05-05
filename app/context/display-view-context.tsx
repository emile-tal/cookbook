'use client'

import { createContext, useContext, useState } from 'react';

type DisplayViewContextType = {
    displayView: "list" | "grid";
    setDisplayView: (displayView: "list" | "grid") => void;
};

const DisplayViewContext = createContext<DisplayViewContextType | undefined>(undefined);

export const DisplayViewProvider = ({ children }: { children: React.ReactNode }) => {
    const [displayView, setDisplayView] = useState<"list" | "grid">("grid");

    return (
        <DisplayViewContext.Provider value={{ displayView, setDisplayView }}>
            {children}
        </DisplayViewContext.Provider>
    )
}


export function useDisplayView() {
    const context = useContext(DisplayViewContext);
    if (!context) {
        throw new Error('useDisplayView must be used within a DisplayViewProvider');
    }
    return context;
} 