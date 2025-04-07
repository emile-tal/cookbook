import BooksClientLayout from "./client-layout";
import { Suspense } from "react";

export default async function BooksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div className="container-spacing">Loading...</div>}>
            <BooksClientLayout>
                {children}
            </BooksClientLayout>
        </Suspense>
    );
}
