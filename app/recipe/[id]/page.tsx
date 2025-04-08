import RecipeLogger from "@/app/components/RecipeLogger";
import RecipePage from '@/app/ui/recipe/recipe-page';
import { fetchRecipeById } from "@/app/lib/data/recipes";
import { getCurrentUser } from "@/app/lib/auth";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    const recipe = await fetchRecipeById(id);
    const user = await getCurrentUser();

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return (
        <>
            <RecipeLogger recipeId={id} />
            <RecipePage recipe={recipe} username={user?.username ?? null} />
        </>
    )
}