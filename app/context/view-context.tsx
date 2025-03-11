'use client'

import { createContext, useContext } from 'react';

type ViewContextType = {
    view: "list" | "grid";
    setView: (view: "list" | "grid") => void;
};

export const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function useView() {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error('useView must be used within a ViewProvider');
    }
    return context;
} 