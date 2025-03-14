import Image from "next/image";
import { fetchRecipeById } from "@/app/lib/data";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    const recipe = await fetchRecipeById(id);

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return (
        <main className="container-spacing py-8">
            <div className="flex flex-col items-center gap-4">
                <Image src={recipe.image_url} alt={recipe.title} width={200} height={200} className="rounded-lg" />
                <h1 className="text-2xl font-bold">{recipe.title}</h1>
                <p>{recipe.description}</p>
                <div className="grid grid-cols-4 gap-x-12">
                    <div className="col-span-1">
                        <h2 className="text-lg font-bold pb-2">Ingredients</h2>
                        {recipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2">
                                <span className="col-span-1">{ingredient.amount}</span>
                                <span className="col-span-2">{ingredient.ingredient}</span>
                            </div>
                        ))}
                    </div>
                    <div className="col-span-3">
                        <h2 className="text-lg font-bold pb-2">Instructions</h2>
                        {recipe.instructions.sort((a, b) => a.position - b.position).map((instruction, index) => (
                            <div key={index} className="flex gap-2 py-2">
                                <span className="text-2xl font-bold">{instruction.position}</span>
                                <span>{instruction.instruction}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}