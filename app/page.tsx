import { fetchEditableBooks, fetchMostViewedBooks, fetchRecentlyViewedBooks, fetchSavedBooks } from "./lib/data/recipebooks/fetch";
import { fetchMostViewedRecipes, fetchMostViewedRecipesByUser, fetchRecentlyViewedRecipesByUser, fetchSavedRecipesByQuery } from "./lib/data/recipes/fetch";

import BooksGrid from "./ui/books/books-grid";
import RecipesGrid from "./ui/books/recipes-grid";

export default async function Page() {
  const [recentlyViewedRecipesByUser, mostViewedRecipesByUser, mostViewedRecipes, recentlyViewedBooks, mostViewedBooks, savedBooks, editableBooks, savedRecipes] = await Promise.all([
    fetchRecentlyViewedRecipesByUser(),
    fetchMostViewedRecipesByUser(),
    fetchMostViewedRecipes(),
    fetchRecentlyViewedBooks(),
    fetchMostViewedBooks(),
    fetchSavedBooks(),
    fetchEditableBooks(),
    fetchSavedRecipesByQuery()
  ]);

  return (
    <main className="container-spacing mb-8">
      {mostViewedRecipes && mostViewedRecipes.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Most Popular Recipes</h2>
        <RecipesGrid recipes={mostViewedRecipes} editableBooks={editableBooks} savedRecipes={savedRecipes?.map((recipe) => recipe.id) || []} />
      </div>}
      {recentlyViewedRecipesByUser && recentlyViewedRecipesByUser.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Recipes</h2>
        <RecipesGrid recipes={recentlyViewedRecipesByUser} editableBooks={editableBooks} savedRecipes={savedRecipes?.map((recipe) => recipe.id) || []} />
      </div>}
      {mostViewedRecipesByUser && mostViewedRecipesByUser.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Most Viewed Recipes</h2>
        <RecipesGrid recipes={mostViewedRecipesByUser} editableBooks={editableBooks} savedRecipes={savedRecipes?.map((recipe) => recipe.id) || []} />
      </div>}
      {recentlyViewedBooks && recentlyViewedBooks.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Books</h2>
        <BooksGrid books={recentlyViewedBooks} savedBooks={savedBooks?.map((book) => book.id) || []} />
      </div>}
      {mostViewedBooks && mostViewedBooks.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Most Popular Books</h2>
        <BooksGrid books={mostViewedBooks} savedBooks={savedBooks?.map((book) => book.id) || []} />
      </div>}
    </main>
  );
}
