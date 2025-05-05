import { fetchEditableBooks, fetchPublicBooksByUserId, fetchSavedBooks } from "@/app/lib/data/recipebooks/fetch";

import ProfileDisplay from "./profile-display";
import { fetchAllPublicRecipesByUserId } from "@/app/lib/data/recipes/fetch";

export default async function ProfileContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [userRecipes, userBooks, editableBooks, savedBooks] = await Promise.all([
        fetchAllPublicRecipesByUserId(id),
        fetchPublicBooksByUserId(id),
        fetchEditableBooks(),
        fetchSavedBooks()
    ])

    if (!userRecipes || !userBooks || !editableBooks || !savedBooks) {
        return <div>Error loading profile content</div>
    }

    return (
        <ProfileDisplay userRecipes={userRecipes} userBooks={userBooks} editableBooks={editableBooks} savedBooks={savedBooks} />
    )
}