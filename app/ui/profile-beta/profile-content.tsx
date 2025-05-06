import { fetchEditableBooks, fetchPublicBooksByUserId, fetchSavedBooks, fetchSharedBooksByQuery, fetchUserBooks } from "@/app/lib/data/recipebooks/fetch";

import ProfileDisplay from "./profile-display";
import { fetchAllPublicRecipesByUserId } from "@/app/lib/data/recipes/fetch";
import { getCurrentUser } from "@/app/lib/auth";

interface ProfileContentProps {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string }>
}

export default async function ProfileContent({ params, searchParams }: ProfileContentProps) {
    const { id } = await params;
    const { q } = await searchParams
    const user = await getCurrentUser()

    const [userRecipes, userBooks, editableBooks] = await Promise.all([
        fetchAllPublicRecipesByUserId(id, q),
        fetchPublicBooksByUserId(id, q),
        fetchEditableBooks(),
    ])

    let savedBooks
    let sharedBooks
    let ownedBooks

    if (user?.id === id) {
        [savedBooks, sharedBooks, ownedBooks] = await Promise.all([
            fetchSavedBooks(q),
            fetchSharedBooksByQuery(q),
            fetchUserBooks(q),
        ])
    }


    if (!userRecipes || !userBooks || !editableBooks) {
        return <div>Error loading profile content</div>
    }

    return (
        <div className='sm:col-span-2 md:col-span-3 lg:col-span-4'>
            <ProfileDisplay userRecipes={userRecipes} userBooks={userBooks} editableBooks={editableBooks} savedBooks={savedBooks || null} sharedBooks={sharedBooks || null} ownedBooks={ownedBooks || null} />
        </div>
    )
}