'use server'

import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sql from '../lib/db';
import { z } from "zod";

type RawIngredient = {
    position: number;
    amount: string | null;
    ingredient: string;
};

type RawInstruction = {
    position: number;
    instruction: string;
};

const ingredientSchema = z.object({
    position: z.number(),
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

    categories: z.string().transform((str) => {
        try {
            return z.array(z.string()).parse(JSON.parse(str));
        } catch (error) {
            console.error(error)
            return [];
        }
    }).default('[]'),
    duration: z.coerce.number().optional().default(0),
    recipe_yield: z.coerce.number().optional().default(0),
    is_public: z.boolean(),
    image_url: z.string().optional(),
    ingredients: z.string().transform((str) => {
        const parsed = JSON.parse(str);
        return z.array(ingredientSchema).parse(
            parsed.filter((ing: RawIngredient) => ing.ingredient.trim() !== "").map((ing: RawIngredient) => ({
                ...ing,
                position: ing.position || 0,
                amount: ing.amount || ''
            }))
        );
    }),
    instructions: z.string().transform((str) => {
        const parsed = JSON.parse(str);
        return z.array(instructionSchema).parse(
            parsed.filter((inst: RawInstruction) => inst.instruction.trim() !== "")
        );
    }),
});

const recipeFormSchema = recipeSchema.omit({ id: true });

export type RecipeFormState = {
    errors?: {
        [key: string]: string[]
    }
    message?: string | null
}

export async function recipeAction(prevState: RecipeFormState, formData: FormData, id?: string): Promise<RecipeFormState> {
    const user = await getCurrentUser();
    if (!user) {
        return {
            errors: {
                message: ["You must be logged in to create or edit a recipe"]
            }
        }
    }

    try {
        // Parse the form data
        const rawFormData = Object.fromEntries(formData);

        // Convert checkbox to boolean and handle empty strings
        const formDataWithBoolean = {
            ...rawFormData,
            is_public: formData.get('is_public') === 'on',
            duration: rawFormData.duration || 0,
            description: rawFormData.description || '',
            categories: JSON.stringify(
                JSON.parse(rawFormData.categories as string).map((cat: string) => cat)
            ),
            ingredients: JSON.stringify(
                JSON.parse(rawFormData.ingredients as string).map((ing: RawIngredient) => ({
                    ...ing,
                    amount: ing.amount || ''
                }))
            )
        };

        // Use different schema based on whether we're updating or creating
        const validatedFields = id
            ? recipeSchema.safeParse({ ...formDataWithBoolean, id })
            : recipeFormSchema.safeParse(formDataWithBoolean);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: `Missing Fields. Failed to ${id ? 'Update' : 'Create'} Recipe.`
            };
        }

        const { title, description, duration, is_public, ingredients, instructions, image_url, categories, recipe_yield } = validatedFields.data;

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

        const claims = JSON.stringify({ sub: user.id });
        await sql`SELECT set_config('request.jwt.claims', ${claims}, true)`;

        if (id) {

            await sql`
                UPDATE recipes
                SET title = ${title}, 
                    description = ${description || ''}, 
                    duration = ${duration || 0}, 
                    recipe_yield = ${recipe_yield || 0},
                    is_public = ${is_public},
                    image_url = ${image_url || null}
                WHERE id = ${id}
            `;

            // Delete existing ingredients, instructions and categories
            await sql`DELETE FROM ingredients WHERE recipe_id = ${id}`;
            await sql`DELETE FROM instructions WHERE recipe_id = ${id}`;
            await sql`DELETE FROM recipecategories WHERE recipe_id = ${id}`;

            if (ingredients.length > 0) {
                await Promise.all(
                    ingredients.map(ingredient =>
                        sql`INSERT INTO ingredients (recipe_id, position, amount, ingredient)
                                VALUES (${id}, ${ingredient.position}, ${ingredient.amount || ''}, ${ingredient.ingredient})`
                    )
                );
            }

            if (instructions.length > 0) {
                await Promise.all(
                    instructions.map(instruction =>
                        sql`INSERT INTO instructions (recipe_id, position, instruction)
                                VALUES (${id}, ${instruction.position}, ${instruction.instruction})`
                    )
                );
            }

            if (categories.length > 0) {
                await Promise.all(
                    categories.map(category =>
                        sql`INSERT INTO recipecategories (recipe_id, category)
                                VALUES (${id}, ${category.toLowerCase()})`
                    )
                );
            }

            revalidatePath(`/recipe/${id}`);
            return redirect(`/recipe/${id}`);
        } else {
            const [newRecipe] = await sql<[{ id: string }]>`
                INSERT INTO recipes (title, description, duration, recipe_yield, is_public, user_id, image_url)
                VALUES (${title}, ${description || ''}, ${duration || 0}, ${recipe_yield || 0}, ${is_public}, ${user.id}, ${image_url || null})
                RETURNING id
            `;

            // Insert ingredients
            if (ingredients.length > 0) {
                await Promise.all(
                    ingredients.map(ingredient =>
                        sql`INSERT INTO ingredients (recipe_id, position, amount, ingredient)
                                VALUES (${newRecipe.id}, ${ingredient.position}, ${ingredient.amount || ''}, ${ingredient.ingredient})`
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

            // Insert categories
            if (categories.length > 0) {
                await Promise.all(
                    categories.map(category =>
                        sql`INSERT INTO recipecategories (recipe_id, category)
                                VALUES (${newRecipe.id}, ${category.toLowerCase()})`
                    )
                );
            }

            // Check if a book ID was provided to associate this recipe with
            const bookId = formData.get('bookId');
            if (bookId) {
                console.log(`Adding recipe ${newRecipe.id} to book ${bookId}`);
                // Add the recipe to the specified book
                await sql`
                    INSERT INTO recipeBookRecipes (book_id, recipe_id)
                    VALUES (${bookId.toString()}, ${newRecipe.id})
                `;
            }

            revalidatePath(`/recipe/${newRecipe.id}`);
            return redirect(`/recipe/${newRecipe.id}`);
        }

    } catch (error) {
        // Ignore Next.js redirect errors - they're expected behavior
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error; // Re-throw redirect errors for Next.js to handle
        }

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