'use client'

import { Book, LiteRecipe } from "@/app/types/definitions"

import { BookDisplay } from "@/app/ui/books/book-display";
import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { useBookRecipeContext } from "@/app/context/book-recipe-context";

interface ProfileDisplayProps {
    userRecipes: LiteRecipe[],
    userBooks: Book[],
    editableBooks: Book[],
}

export default function ProfileDisplay({ userRecipes, userBooks, editableBooks }: ProfileDisplayProps) {
    const { bookRecipeView } = useBookRecipeContext();

    if (bookRecipeView === "books") {
        return (
            <BookDisplay books={userBooks} />
        )
    } else {
        return (
            <RecipesDisplay recipes={userRecipes} editableBooks={editableBooks} />
        )
    }
}