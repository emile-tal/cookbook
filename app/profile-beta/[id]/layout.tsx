'use client'

import { BookFilterProvider } from "@/app/context/book-filter-context";
import { BookRecipeProvider } from "../../context/book-recipe-context";
import { DisplayViewProvider } from "../../context/display-view-context";
import ProfileStateInitializer from "@/app/ui/profile-beta/profile-state-initializer";
import { RecipeFilterProvider } from "@/app/context/recipe-filter-context";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {

    return (
        <BookRecipeProvider>
            <DisplayViewProvider>
                <BookFilterProvider>
                    <RecipeFilterProvider>
                        <ProfileStateInitializer />
                        <div className="container-spacing mb-8">
                            {children}
                        </div>
                    </RecipeFilterProvider>
                </BookFilterProvider>
            </DisplayViewProvider>
        </BookRecipeProvider>
    );
} 