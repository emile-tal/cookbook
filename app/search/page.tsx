import SearchResultsContent from "../ui/search-results-content"
import { Suspense } from "react"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResultsContent q={q} />
            </Suspense>
        </div>
    )
}