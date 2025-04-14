import CommentSection from "@/app/ui/recipe/comments-section";
import RecipeDetails from '@/app/ui/recipe/recipe-details';
import RecipeLogger from "@/app/components/RecipeLogger";
import { fetchRecipeById } from "@/app/lib/data/recipes/fetch";
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
            <RecipeDetails recipe={recipe} username={user?.username ?? null} />
            <CommentSection recipeId={id} />
        </>
    )
}