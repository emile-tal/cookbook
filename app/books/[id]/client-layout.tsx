'use client'

import { useEffect, useState } from "react";

import { BookNavBar } from "@/app/ui/books/nav-bar";
import { ViewContext } from "@/app/context/view-context";

export default function ClientBookLayout({ children, canEdit }: { children: React.ReactNode, canEdit: boolean }) {
    const [view, setView] = useState<"list" | "grid">("grid");

    // Load saved preference from localStorage
    useEffect(() => {
        const savedView = localStorage.getItem("booksView");
        if (savedView === "list" || savedView === "grid") {
            setView(savedView);
        }
    }, []);

    // Save preference when it changes
    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: "list" | "grid" | null) => {
        if (newView) {
            setView(newView);
            localStorage.setItem("booksView", newView);
        }
    };

    return (
        <ViewContext.Provider value={{ view, setView }}>
            <div>
                <BookNavBar
                    view={view}
                    handleViewChange={handleViewChange}
                    canEdit={canEdit}
                />
                {children}
            </div>
        </ViewContext.Provider>
    );
}