'use server'

import BooksClientLayout from "./client-layout";
import Loading from "@/app/ui/loading";
import { Suspense } from "react";

export default async function BooksLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="container-spacing">
                <Loading size={24} />
            </div>
        }>
            <BooksClientLayout>
                {children}
            </BooksClientLayout>
        </Suspense>
    );
}
