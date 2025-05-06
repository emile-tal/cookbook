'use client'

import { Book, LiteRecipe } from "@/app/types/definitions"

import { BookDisplay } from "@/app/ui/books/book-display";
import NoBooks from "../books/no-books";
import { RecipesDisplay } from "@/app/ui/books/recipes-display";
import { useBookFilterContext } from "@/app/context/book-filter-context";
import { useBookRecipeContext } from "@/app/context/book-recipe-context";
import { useRecipeFilterContext } from "@/app/context/recipe-filter-context";

interface ProfileDisplayProps {
    userRecipes: LiteRecipe[],
    userBooks: Book[],
    editableBooks: Book[],
    savedBooks: Book[] | null,
    sharedBooks: Book[] | null,
    ownedBooks: Book[] | null,
}

export default function ProfileDisplay({ userRecipes, userBooks, editableBooks, savedBooks, sharedBooks, ownedBooks }: ProfileDisplayProps) {
    const { bookRecipeView } = useBookRecipeContext();
    const { bookFilter } = useBookFilterContext();
    const { recipeFilter } = useRecipeFilterContext();

    if (bookRecipeView === "books") {
        if (bookFilter === "all") {
            return (
                <BookDisplay books={userBooks} />
            )
        } else if (bookFilter === "owned") {
            return (
                ownedBooks && ownedBooks.length > 0 ? (
                    <BookDisplay books={ownedBooks} savedBooks={ownedBooks.map(book => book.id)} />
                ) : (
                    <NoBooks message="You haven't created any recipe books yet." />
                )
            )
        } else if (bookFilter === "saved") {
            return (
                savedBooks && savedBooks.length > 0 ? (
                    <BookDisplay books={savedBooks} savedBooks={savedBooks.map(book => book.id)} />
                ) : (
                    <NoBooks message="You haven't saved any books yet." />
                )
            )
        } else if (bookFilter === "shared" && sharedBooks) {
            return (
                sharedBooks && sharedBooks.length > 0 ? (
                    <BookDisplay books={sharedBooks} savedBooks={sharedBooks.map(book => book.id)} />
                ) : (
                    <NoBooks message="No shared books available yet." />
                )
            )
        }
    } else {
        return (
            <RecipesDisplay recipes={userRecipes} editableBooks={editableBooks} />
        )
    }
}