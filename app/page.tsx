import { fetchMostViewedBooks, fetchRecentlyViewedBooks, fetchRecipeCountByBookId } from "./lib/data/recipeBook";
import { fetchMostViewedRecipes, fetchRecentlyViewedRecipes } from "./lib/data/recipes";

import BooksGrid from "./ui/books/books-grid";
import RecipesGrid from "./ui/books/recipes-grid";

export default async function Page() {
  const recentlyViewedBooks = await fetchRecentlyViewedBooks();
  const mostViewedBooks = await fetchMostViewedBooks();
  const recentlyViewedRecipes = await fetchRecentlyViewedRecipes();
  const mostViewedRecipes = await fetchMostViewedRecipes();
  const recipeCountByBook = await fetchRecipeCountByBookId();

  return (
    <main className="container-spacing">
      <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Recipes</h2>
        {recentlyViewedRecipes && <RecipesGrid recipes={recentlyViewedRecipes} edit={false} />}
      </div>
      <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Most Viewed Recipes</h2>
        {mostViewedRecipes && <RecipesGrid recipes={mostViewedRecipes} edit={false} />}
      </div>
      <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Recently Viewed Books</h2>
        {recentlyViewedBooks && <BooksGrid books={recentlyViewedBooks} recipeCountByBook={recipeCountByBook} />}
      </div>
      <div className="flex flex-col gap-4 py-4">
        <h2 className="text-xl font-bold">Your Most Viewed Books</h2>
        {mostViewedBooks && <BooksGrid books={mostViewedBooks} recipeCountByBook={recipeCountByBook} />}
      </div>
    </main>
  );
}
