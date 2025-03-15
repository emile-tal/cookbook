'use server'

import postgres from "postgres";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const recipeSchema = z.object({
    id: z.string(),
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    description: z.string().optional(),
    category: z.string().optional(),
    duration: z.coerce.number().gt(0, { message: "Please enter a duration longer than 0 minutes" }).optional(),
    is_public: z.boolean(),
    ingredients: z.array(z.object({
        amount: z.string().optional(),
        ingredient: z.string(),
    })),
    instructions: z.array(z.object({
        position: z.number(),
        instruction: z.string(),
    })),
});

const recipeFormSchema = recipeSchema.omit({ id: true });

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type RecipeFormState = {
    errors?: {
        [key: string]: string[]
    }
    message?: string | null
}

export async function recipeAction(prevState: RecipeFormState, formData: FormData, id?: string): Promise<RecipeFormState> {
    const validatedFields = recipeFormSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: `Missing Fields. Failed to ${id ? 'Update' : 'Create'} Recipe.`
        };
    }

    const { title, description, category, duration, is_public, ingredients, instructions } = validatedFields.data;

    try {
        if (id) {
            // Update existing recipe
            await sql`
                UPDATE recipes
                SET title = ${title}, description = ${description || null}, 
                    category = ${category || null}, duration = ${duration || null}, 
                    is_public = ${is_public}
                WHERE id = ${id}
            `;

            // Delete existing ingredients and instructions
            await sql`DELETE FROM ingredients WHERE recipe_id = ${id}`;
            await sql`DELETE FROM instructions WHERE recipe_id = ${id}`;

            // Insert new ingredients
            await Promise.all(
                ingredients.map(ingredient =>
                    sql`INSERT INTO ingredients (recipe_id, amount, ingredient)
                            VALUES (${id}, ${ingredient.amount || null}, ${ingredient.ingredient})`
                )
            );

            // Insert new instructions
            await Promise.all(
                instructions.map(instruction =>
                    sql`INSERT INTO instructions (recipe_id, position, instruction)
                            VALUES (${id}, ${instruction.position}, ${instruction.instruction})`
                )
            );

            revalidatePath(`/recipe/${id}`);
            redirect(`/recipe/${id}`);
        } else {
            // Create new recipe
            const [newRecipe] = await sql<[{ id: string }]>`
                INSERT INTO recipes (title, description, category, duration, is_public)
                VALUES (${title}, ${description || null}, ${category || null}, ${duration || null}, ${is_public})
                RETURNING id
            `;

            // Insert ingredients
            await Promise.all(
                ingredients.map(ingredient =>
                    sql`INSERT INTO ingredients (recipe_id, amount, ingredient)
                            VALUES (${newRecipe.id}, ${ingredient.amount || null}, ${ingredient.ingredient})`
                )
            );

            // Insert instructions
            await Promise.all(
                instructions.map(instruction =>
                    sql`INSERT INTO instructions (recipe_id, position, instruction)
                            VALUES (${newRecipe.id}, ${instruction.position}, ${instruction.instruction})`
                )
            );

            revalidatePath(`/recipe/${newRecipe.id}`);
            redirect(`/recipe/${newRecipe.id}`);
        }

        return {
            message: `Recipe ${id ? 'updated' : 'added'} successfully.`
        };
    } catch (error) {
        console.error(error);
        return {
            message: `Database Error: Failed to ${id ? 'update' : 'create'} recipe.`,
        };
    }
}
