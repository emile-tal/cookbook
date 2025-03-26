// Server Component
import { fetchAllBooks, fetchAllRecipes } from "@/app/lib/data";

import BooksClientLayout from "./client-layout";
import { Suspense } from "react";

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
        <Suspense fallback={<div>Loading...</div>}>
            <BooksClientLayout initialBooks={books} initialRecipes={recipes}>
                {children}
            </BooksClientLayout>
        </Suspense>
    );
}
