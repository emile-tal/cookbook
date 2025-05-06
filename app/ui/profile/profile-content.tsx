import { fetchAllPublicRecipesByUserId, fetchEditableRecipes, fetchSavedRecipesByQuery, fetchSharedRecipesByQuery, fetchUserRecipesByQuery } from "@/app/lib/data/recipes/fetch";
import { fetchEditableBooks, fetchPublicBooksByUserId, fetchSavedBooks, fetchSharedBooksByQuery, fetchUserBooks } from "@/app/lib/data/recipebooks/fetch";

import ProfileDisplay from "./profile-display";
import { getCurrentUser } from "@/app/lib/auth";

interface ProfileContentProps {
    id: string,
    searchParams: string | undefined
}

export default async function ProfileContent({ id, searchParams }: ProfileContentProps) {
    const q = searchParams || ''
    const user = await getCurrentUser()

    const [userRecipes, userBooks] = await Promise.all([
        fetchAllPublicRecipesByUserId(id, q),
        fetchPublicBooksByUserId(id, q),
    ])

    let savedBooks
    let sharedBooks
    let ownedBooks
    let savedRecipes
    let ownedRecipes
    let sharedRecipes
    let editableBooks
    let editableRecipes

    if (user) {
        [savedBooks, savedRecipes, editableBooks, editableRecipes] = await Promise.all([
            fetchSavedBooks(q),
            fetchSavedRecipesByQuery(q),
            fetchEditableBooks(),
            fetchEditableRecipes()
        ])
    }

    if (user?.id === id) {
        [sharedBooks, ownedBooks, ownedRecipes, sharedRecipes] = await Promise.all([
            fetchSharedBooksByQuery(q),
            fetchUserBooks(q),
            fetchUserRecipesByQuery(q),
            fetchSharedRecipesByQuery(q)
        ])
    }


    if (!userRecipes || !userBooks || !editableBooks) {
        return <div>Error loading profile content</div>
    }

    return (
        <div className='sm:col-span-2 md:col-span-3 lg:col-span-4'>
            <ProfileDisplay
                userRecipes={userRecipes}
                userBooks={userBooks}
                editableBooks={editableBooks}
                savedBooks={savedBooks || null}
                sharedBooks={sharedBooks || null}
                ownedBooks={ownedBooks || null}
                savedRecipes={savedRecipes || null}
                ownedRecipes={ownedRecipes || null}
                sharedRecipes={sharedRecipes || null}
                editableRecipes={editableRecipes || null} />
        </div>
    )
}