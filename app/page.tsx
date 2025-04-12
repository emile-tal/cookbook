import { fetchAllRecipesByQuery, fetchMostViewedRecipes, fetchMostViewedRecipesByUser, fetchRecentlyViewedRecipesByUser } from "./lib/data/recipes/fetch";
import { fetchMostViewedBooks, fetchRecentlyViewedBooks, fetchSavedBooks, fetchUserBooks } from "./lib/data/recipebooks/fetch";

import BooksGrid from "./ui/books/books-grid";
import RecipesGrid from "./ui/books/recipes-grid";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const [recentlyViewedRecipesByUser, mostViewedRecipesByUser, mostViewedRecipes, recentlyViewedBooks, mostViewedBooks, savedBooks, userBooks] = await Promise.all([
    fetchRecentlyViewedRecipesByUser(),
    fetchMostViewedRecipesByUser(),
    fetchMostViewedRecipes(),
    fetchRecentlyViewedBooks(),
    fetchMostViewedBooks(),
    fetchSavedBooks(),
    fetchUserBooks()
  ]);

  const allRecipes = await fetchAllRecipesByQuery(q)

  // TODO: Need to find a way for user to change from recipes to books
  // const allBooks = await fetchAllPublicBooksByQuery(q)

  return (
    <main className="container-spacing mb-8">
      {q ? (
        <div className="flex flex-col gap-4 py-4">
          <h2 className="text-xl font-bold">Search Results</h2>
          <RecipesGrid recipes={allRecipes} userBooks={userBooks} />
        </div>
      ) : (
        <>
          {mostViewedRecipes && mostViewedRecipes.length > 0 && <div className="flex flex-col gap-4 py-4">
            <h2 className="text-xl font-bold">Most Popular Recipes</h2>
            <RecipesGrid recipes={mostViewedRecipes} userBooks={userBooks} />
          </div>}
          {recentlyViewedRecipesByUser && recentlyViewedRecipesByUser.length > 0 && <div className="flex flex-col gap-4 py-4">
            <h2 className="text-xl font-bold">Your Recently Viewed Recipes</h2>
            <RecipesGrid recipes={recentlyViewedRecipesByUser} userBooks={userBooks} />
          </div>}
          {mostViewedRecipesByUser && mostViewedRecipesByUser.length > 0 && <div className="flex flex-col gap-4 py-4">
            <h2 className="text-xl font-bold">Your Most Viewed Recipes</h2>
            <RecipesGrid recipes={mostViewedRecipesByUser} userBooks={userBooks} />
          </div>}
          {recentlyViewedBooks && recentlyViewedBooks.length > 0 && <div className="flex flex-col gap-4 py-4">
            <h2 className="text-xl font-bold">Your Recently Viewed Books</h2>
            <BooksGrid books={recentlyViewedBooks} savedBooks={savedBooks?.map((book) => book.id) || []} />
          </div>}
          {mostViewedBooks && mostViewedBooks.length > 0 && <div className="flex flex-col gap-4 py-4">
            <h2 className="text-xl font-bold">Most Popular Books</h2>
            <BooksGrid books={mostViewedBooks} savedBooks={savedBooks?.map((book) => book.id) || []} />
          </div>}
        </>
      )}
    </main>
  );
}
