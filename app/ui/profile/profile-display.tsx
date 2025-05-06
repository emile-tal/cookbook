'use client'

import { Book, LiteRecipe } from "@/app/types/definitions"

import { BookDisplay } from "@/app/ui/books/book-display";
import NoBooks from "../books/no-books";
import NoRecipes from "../recipe/no-recipes";
import { RecipesDisplay } from "@/app/ui/recipe/recipes-display";
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
    savedRecipes: LiteRecipe[] | null,
    ownedRecipes: LiteRecipe[] | null,
    sharedRecipes: LiteRecipe[] | null,
    editableRecipes: string[] | null
}

export default function ProfileDisplay({ userRecipes, userBooks, editableBooks, savedBooks, sharedBooks, ownedBooks, savedRecipes, ownedRecipes, sharedRecipes, editableRecipes }: ProfileDisplayProps) {
    const { bookRecipeView } = useBookRecipeContext();
    const { bookFilter } = useBookFilterContext();
    const { recipeFilter } = useRecipeFilterContext();

    if (bookRecipeView === "books") {
        if (bookFilter === "all") {
            return (
                <BookDisplay books={userBooks} savedBooks={savedBooks?.map(book => book.id) || []} editableBooks={editableBooks} />
            )
        } else if (bookFilter === "owned") {
            return (
                ownedBooks && ownedBooks.length > 0 ? (
                    <BookDisplay books={ownedBooks} savedBooks={savedBooks?.map(book => book.id) || []} editableBooks={editableBooks} />
                ) : (
                    <NoBooks message="You haven't created any recipe books yet." />
                )
            )
        } else if (bookFilter === "saved") {
            return (
                savedBooks && savedBooks.length > 0 ? (
                    <BookDisplay books={savedBooks} savedBooks={savedBooks.map(book => book.id)} editableBooks={editableBooks} />
                ) : (
                    <NoBooks message="You haven't saved any books yet." />
                )
            )
        } else if (bookFilter === "shared" && sharedBooks) {
            return (
                sharedBooks && sharedBooks.length > 0 ? (
                    <BookDisplay books={sharedBooks} savedBooks={savedBooks?.map(book => book.id) || []} editableBooks={editableBooks} />
                ) : (
                    <NoBooks message="No shared books available yet." />
                )
            )
        }
    } else {
        if (recipeFilter === "all") {
            return (
                <RecipesDisplay recipes={userRecipes} editableBooks={editableBooks} savedRecipes={savedRecipes?.map(recipe => recipe.id) || []} editableRecipes={editableRecipes || []} />
            )
        } else if (recipeFilter === "owned") {
            return (
                ownedRecipes && ownedRecipes.length > 0 ? (
                    <RecipesDisplay recipes={ownedRecipes} editableBooks={editableBooks} savedRecipes={savedRecipes?.map(recipe => recipe.id) || []} editableRecipes={editableRecipes || []} />
                ) : (
                    <NoRecipes message="You haven't created any recipes yet." />
                )
            )
        } else if (recipeFilter === "saved") {
            return (
                savedRecipes && savedRecipes.length > 0 ? (
                    <RecipesDisplay recipes={savedRecipes} editableBooks={editableBooks} savedRecipes={savedRecipes.map(recipe => recipe.id) || []} editableRecipes={editableRecipes || []} />
                ) : (
                    <NoRecipes message="You haven't saved any recipes yet." />
                )
            )
        } else if (recipeFilter === "shared" && sharedRecipes) {
            return (
                sharedRecipes && sharedRecipes.length > 0 ? (
                    <RecipesDisplay recipes={sharedRecipes} editableBooks={editableBooks} savedRecipes={savedRecipes?.map(recipe => recipe.id) || []} editableRecipes={editableRecipes || []} />
                ) : (
                    <NoRecipes message="No shared recipes available yet." />
                )
            )
        }
    }
}