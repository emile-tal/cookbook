'use client'

import HomeContent from "./home-content"
import SearchResultsContent from "./home-search-content"
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SearchResults() {
    const searchParams = useSearchParams()
    const q = searchParams.get('q')

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {q ? <SearchResultsContent q={q} /> : <HomeContent />}
        </Suspense>
    )
} 