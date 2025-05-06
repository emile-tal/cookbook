'use client'

import { useEffect, useState } from "react";

import { BookNavBar } from "@/app/ui/books/nav-bar";
import { DisplayViewProvider } from "@/app/context/display-view-context";

export default function ClientBookLayout({ children, canEdit }: { children: React.ReactNode, canEdit: boolean }) {
    const [displayView, setDisplayView] = useState<"list" | "grid">("grid");

    // Load saved preference from localStorage
    useEffect(() => {
        const savedDisplayView = localStorage.getItem("booksView");
        if (savedDisplayView === "list" || savedDisplayView === "grid") {
            setDisplayView(savedDisplayView);
        }
    }, []);

    // Save preference when it changes
    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: "list" | "grid" | null) => {
        if (newView) {
            setDisplayView(newView);
            localStorage.setItem("booksView", newView);
        }
    };

    return (
        <DisplayViewProvider>
            <div className="container-spacing">
                <BookNavBar
                    displayView={displayView}
                    handleViewChange={handleViewChange}
                    canEdit={canEdit}
                />
                {children}
            </div>
        </DisplayViewProvider>
    );
}