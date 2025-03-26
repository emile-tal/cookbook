'use client'

import { Book, Recipe } from "@/app/lib/definitions";
import React, { useEffect, useState } from "react";

import { BookNavBar } from "@/app/ui/books/nav-bar";
import { ViewContext } from "@/app/context/view-context";

interface BooksLayoutProps {
    children: React.ReactNode;
    initialBooks: Book[];
    initialRecipes: Recipe[];
}

// Define the interface for child components that might receive books/recipes props
interface ChildProps {
    books?: Book[];
    recipes?: Recipe[];
}

export default function BooksClientLayout({ children, initialBooks, initialRecipes }: BooksLayoutProps) {
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
            <div className="container-spacing">
                <BookNavBar
                    view={view}
                    handleViewChange={handleViewChange}
                />
                <div>
                    {React.Children.map(children, child => {
                        if (React.isValidElement<ChildProps>(child)) {
                            return React.cloneElement(child, {
                                books: initialBooks,
                                recipes: initialRecipes
                            });
                        }
                        return child;
                    })}
                </div>
            </div>
        </ViewContext.Provider>
    );
} 