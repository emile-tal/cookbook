import BooksClientLayout from "./client-layout";
import { Suspense } from "react";
// Server Component
import { fetchAllBooks } from "@/app/lib/data/recipeBook";
import { fetchAllRecipes } from "@/app/lib/data/recipes";

export default async function BooksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch data on the server
    const [books, recipes] = await Promise.all([
        fetchAllBooks(),
        fetchAllRecipes()
    ]);

    return (
        <Suspense fallback={<div className="container-spacing">Loading...</div>}>
            <BooksClientLayout initialBooks={books} initialRecipes={recipes}>
                {children}
            </BooksClientLayout>
        </Suspense>
    );
}
