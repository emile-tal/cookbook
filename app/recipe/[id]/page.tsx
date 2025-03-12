import { fetchRecipe } from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const recipe = await fetchRecipe(id);

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return (
        <div>{recipe.title}</div>
    );
}