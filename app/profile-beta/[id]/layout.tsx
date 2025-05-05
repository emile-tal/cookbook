'use client'

import { BookRecipeProvider } from "../../context/book-recipe-context";
import { DisplayViewProvider } from "../../context/display-view-context";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {

    return (
        <BookRecipeProvider>
            <DisplayViewProvider>
                <div className="container-spacing mb-8">
                    {children}
                </div>
            </DisplayViewProvider>
        </BookRecipeProvider>
    );
} 