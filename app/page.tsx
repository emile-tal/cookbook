import SearchResults from '@/app/ui/search-results'
import { Suspense } from 'react'

export default function Page() {
  return (
    <main className="container-spacing mb-8">
      <Suspense fallback={<div>Loading content...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
