import { fetchMostViewedBooks, fetchRecentlyViewedBooks, fetchRecipeCountByBookId, fetchSavedBooks, fetchUserBooks } from "./lib/data/recipeBook";
import { fetchMostViewedRecipes, fetchMostViewedRecipesByUser, fetchRecentlyViewedRecipesByUser } from "./lib/data/recipes";

import BooksGrid from "./ui/books/books-grid";
import RecipesGrid from "./ui/books/recipes-grid";

export default async function Page() {

  const [recentlyViewedRecipesByUser, mostViewedRecipesByUser, mostViewedRecipes, recentlyViewedBooks, mostViewedBooks, savedBooks, userBooks] = await Promise.all([
    fetchRecentlyViewedRecipesByUser(),
    fetchMostViewedRecipesByUser(),
    fetchMostViewedRecipes(),
    fetchRecentlyViewedBooks(),
    fetchMostViewedBooks(),
    fetchSavedBooks(),
    fetchUserBooks()
  ]);
  const recipeCountByBook = await fetchRecipeCountByBookId();

  return (
    <main className="container-spacing">
      {mostViewedRecipes && mostViewedRecipes.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Most Popular Recipes</h2>
        <RecipesGrid recipes={mostViewedRecipes} books={userBooks} />
      </div>}
      {recentlyViewedRecipesByUser && recentlyViewedRecipesByUser.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Recipes</h2>
        <RecipesGrid recipes={recentlyViewedRecipesByUser} books={userBooks} />
      </div>}
      {mostViewedRecipesByUser && mostViewedRecipesByUser.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Most Viewed Recipes</h2>
        <RecipesGrid recipes={mostViewedRecipesByUser} books={userBooks} />
      </div>}
      {recentlyViewedBooks && recentlyViewedBooks.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Books</h2>
        <BooksGrid books={recentlyViewedBooks} recipeCountByBook={recipeCountByBook} savedBooks={savedBooks?.map((book) => book.id) || []} />
      </div>}
      {mostViewedBooks && mostViewedBooks.length > 0 && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Most Popular Books</h2>
        <BooksGrid books={mostViewedBooks} recipeCountByBook={recipeCountByBook} savedBooks={savedBooks?.map((book) => book.id) || []} />
      </div>}

    </main>
  );
}
