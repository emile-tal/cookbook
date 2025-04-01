import { fetchMostViewedBooks, fetchRecentlyViewedBooks, fetchRecipeCountByBookId } from "./lib/data/recipeBook";
import { fetchMostViewedRecipes, fetchMostViewedRecipesByUser, fetchRecentlyViewedRecipesByUser } from "./lib/data/recipes";

import BooksGrid from "./ui/books/books-grid";
import RecipesGrid from "./ui/books/recipes-grid";

export default async function Page() {

  const [recentlyViewedRecipesByUser, mostViewedRecipesByUser, mostViewedRecipes, recentlyViewedBooks, mostViewedBooks] = await Promise.all([
    fetchRecentlyViewedRecipesByUser(),
    fetchMostViewedRecipesByUser(),
    fetchMostViewedRecipes(),
    fetchRecentlyViewedBooks(),
    fetchMostViewedBooks()
  ]);
  const recipeCountByBook = await fetchRecipeCountByBookId();

  return (
    <main className="container-spacing">
      {mostViewedRecipes && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Most Popular Recipes</h2>
        <RecipesGrid recipes={mostViewedRecipes} edit={false} />
      </div>}
      {recentlyViewedRecipesByUser && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Recipes</h2>
        <RecipesGrid recipes={recentlyViewedRecipesByUser} edit={false} />
      </div>}
      {mostViewedRecipesByUser && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Most Viewed Recipes</h2>
        <RecipesGrid recipes={mostViewedRecipesByUser} edit={false} />
      </div>}
      {recentlyViewedBooks && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Books</h2>
        <BooksGrid books={recentlyViewedBooks} recipeCountByBook={recipeCountByBook} />
      </div>}
      {mostViewedBooks && <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Most Viewed Books</h2>
        <BooksGrid books={mostViewedBooks} recipeCountByBook={recipeCountByBook} />
      </div>}

    </main>
  );
}
