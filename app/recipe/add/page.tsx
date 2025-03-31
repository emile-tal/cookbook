'use client'

import { Suspense, useEffect, useState } from "react";

import RecipeForm from "@/app/ui/recipe/recipe-form";
import { recipeAction } from "@/app/actions/recipe";
import { useSearchParams } from "next/navigation";

// Client component that uses useSearchParams
function RecipePageContent() {
    const searchParams = useSearchParams();
    const bookId = searchParams.get('bookId');
    const [title, setTitle] = useState("Add New Recipe");

    useEffect(() => {
        if (bookId) {
            setTitle(`Add Recipe to Book`);
        }
    }, [bookId]);

    // The bookId can be used later when submitting the form to associate the recipe with the book

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
            {bookId && <p className="mb-4 text-gray-600">This recipe will be added to the book.</p>}
            <RecipeForm formAction={recipeAction} bookId={bookId} />
        </>
    );
}

// Fallback component to show while content is loading
function RecipePageFallback() {
    return <div className="text-center py-4">Loading recipe form...</div>;
}

export default function AddRecipePage() {
    return (
        <main className="container-spacing py-8">
            <div className="max-w-2xl mx-auto">
                <Suspense fallback={<RecipePageFallback />}>
                    <RecipePageContent />
                </Suspense>
            </div>
        </main>
    );
}