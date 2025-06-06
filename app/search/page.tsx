import Loading from "../ui/loading";
import SearchResultsContent from "../ui/search/search-results-content"
import { Suspense } from "react"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;

    return (
        <div>
            <Suspense fallback={<div className="container-spacing">
                <Loading size={24} />
            </div>}>
                <SearchResultsContent q={q} />
            </Suspense>
        </div>
    )
}