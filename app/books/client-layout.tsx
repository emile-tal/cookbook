'use client'

import React, { useEffect, useState } from "react";

import { BookNavBar } from "@/app/ui/books/nav-bar";
import { ViewContext } from "@/app/context/view-context";
import { usePathname } from "next/navigation";

interface BooksLayoutProps {
    children: React.ReactNode;
}

export default function BooksClientLayout({ children }: BooksLayoutProps) {
    const [view, setView] = useState<"list" | "grid">("grid");
    const pathname = usePathname();

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

    const showNavBar = pathname.match(/books$/);

    return (
        <ViewContext.Provider value={{ view, setView }}>
            <div className="container-spacing mb-8">
                {showNavBar && <BookNavBar
                    view={view}
                    handleViewChange={handleViewChange}
                    canEdit
                />}
                <div>
                    {children}
                </div>
            </div>
        </ViewContext.Provider>
    );
} 