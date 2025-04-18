import NotFoundContent from './ui/not-found-content'
// This is a Server Component
import { Suspense } from 'react'

export default function NotFound() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFoundContent />
        </Suspense>
    )
} 