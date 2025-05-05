'use client'

import { createContext, useContext, useEffect, useState } from 'react';

type DisplayViewContextType = {
    displayView: "list" | "grid";
    setDisplayView: (displayView: "list" | "grid") => void;
};

const DisplayViewContext = createContext<DisplayViewContextType | undefined>(undefined);

export const DisplayViewProvider = ({ children }: { children: React.ReactNode }) => {
    const [displayView, setDisplayView] = useState<"list" | "grid">("grid");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const savedDisplayView = localStorage.getItem("displayView");
        if (savedDisplayView === "list" || savedDisplayView === "grid") {
            setDisplayView(savedDisplayView);
        }
        setIsInitialized(true);
    }, []);

    const handleSetDisplayView = (newView: "list" | "grid") => {
        setDisplayView(newView);
        localStorage.setItem("displayView", newView);
    };

    if (!isInitialized) {
        return null;
    }

    return (
        <DisplayViewContext.Provider value={{ displayView, setDisplayView: handleSetDisplayView }}>
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