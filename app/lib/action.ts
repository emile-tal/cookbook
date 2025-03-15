'use server'

import postgres from "postgres";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type RawIngredient = {
    amount: string | null;
    ingredient: string;
};

const ingredientSchema = z.object({
    amount: z.string().nullable().transform(val => val || ''),
    ingredient: z.string()
});

const instructionSchema = z.object({
    position: z.number(),
    instruction: z.string()
});

const recipeSchema = z.object({
    id: z.string(),
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }).trim(),
    description: z.string().default(''),
    category: z.string().default(''),
    duration: z.coerce.number().optional().default(0),
    is_public: z.boolean(),
    ingredients: z.string().transform((str) => {
        const parsed = JSON.parse(str);
        return z.array(ingredientSchema).parse(
            parsed.filter((ing: RawIngredient) => ing.ingredient.trim() !== "").map((ing: RawIngredient) => ({
                ...ing,
                amount: ing.amount || ''
            }))
        );
    }),
    instructions: z.string().transform((str) => {
        const parsed = JSON.parse(str);
        return z.array(instructionSchema).parse(
            parsed.filter((inst: any) => inst.instruction.trim() !== "")
        );
    }),
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
    try {
        // Parse the form data
        const rawFormData = Object.fromEntries(formData);

        // Convert checkbox to boolean and handle empty strings
        const formDataWithBoolean = {
            ...rawFormData,
            is_public: formData.get('is_public') === 'on',
            duration: rawFormData.duration || 0,
            description: rawFormData.description || '',
            category: rawFormData.category || '',
            ingredients: JSON.stringify(
                JSON.parse(rawFormData.ingredients as string).map((ing: RawIngredient) => ({
                    ...ing,
                    amount: ing.amount || ''
                }))
            )
        };

        console.log('Processing recipe with ID:', id);
        console.log('Form data:', formDataWithBoolean);

        // Use different schema based on whether we're updating or creating
        const validatedFields = id
            ? recipeSchema.safeParse({ ...formDataWithBoolean, id })
            : recipeFormSchema.safeParse(formDataWithBoolean);

        if (!validatedFields.success) {
            console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: `Missing Fields. Failed to ${id ? 'Update' : 'Create'} Recipe.`
            };
        }

        const { title, description, category, duration, is_public, ingredients, instructions } = validatedFields.data;

        // Ensure we have at least one ingredient and one instruction
        if (ingredients.length === 0) {
            return {
                errors: { ingredients: ["At least one ingredient is required"] },
                message: "Missing required fields"
            };
        }

        if (instructions.length === 0) {
            return {
                errors: { instructions: ["At least one instruction is required"] },
                message: "Missing required fields"
            };
        }

        if (id) {
            console.log('Updating recipe:', id);
            // Update existing recipe
            await sql`
                UPDATE recipes
                SET title = ${title}, 
                    description = ${description || ''}, 
                    category = ${category || ''}, 
                    duration = ${duration || 0}, 
                    is_public = ${is_public}
                WHERE id = ${id}
            `;

            // Delete existing ingredients and instructions
            await sql`DELETE FROM ingredients WHERE recipe_id = ${id}`;
            await sql`DELETE FROM instructions WHERE recipe_id = ${id}`;

            // Insert new ingredients
            if (ingredients.length > 0) {
                await Promise.all(
                    ingredients.map(ingredient =>
                        sql`INSERT INTO ingredients (recipe_id, amount, ingredient)
                                VALUES (${id}, ${ingredient.amount || ''}, ${ingredient.ingredient})`
                    )
                );
            }

            // Insert new instructions
            if (instructions.length > 0) {
                await Promise.all(
                    instructions.map(instruction =>
                        sql`INSERT INTO instructions (recipe_id, position, instruction)
                                VALUES (${id}, ${instruction.position}, ${instruction.instruction})`
                    )
                );
            }

            revalidatePath(`/recipe/${id}`);
            return redirect(`/recipe/${id}`);
        } else {
            console.log('Creating new recipe');
            // Create new recipe
            const [newRecipe] = await sql<[{ id: string }]>`
                INSERT INTO recipes (title, description, category, duration, is_public)
                VALUES (${title}, ${description || ''}, ${category || ''}, ${duration || 0}, ${is_public})
                RETURNING id
            `;

            // Insert ingredients
            if (ingredients.length > 0) {
                await Promise.all(
                    ingredients.map(ingredient =>
                        sql`INSERT INTO ingredients (recipe_id, amount, ingredient)
                                VALUES (${newRecipe.id}, ${ingredient.amount || ''}, ${ingredient.ingredient})`
                    )
                );
            }

            // Insert instructions
            if (instructions.length > 0) {
                await Promise.all(
                    instructions.map(instruction =>
                        sql`INSERT INTO instructions (recipe_id, position, instruction)
                                VALUES (${newRecipe.id}, ${instruction.position}, ${instruction.instruction})`
                    )
                );
            }

            revalidatePath(`/recipe/${newRecipe.id}`);
            return redirect(`/recipe/${newRecipe.id}`);
        }

        return {
            message: `Recipe ${id ? 'updated' : 'added'} successfully.`
        };
    } catch (error) {
        console.error('Recipe action error:', error);
        if (error instanceof Error) {
            return {
                message: `Database Error: ${error.message}`,
                errors: {}
            };
        }
        return {
            message: `Database Error: Failed to ${id ? 'update' : 'create'} recipe.`,
            errors: {}
        };
    }
}
