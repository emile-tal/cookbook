'use server'

import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sql from '../lib/db';
import { z } from "zod";

const bookSchema = z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string().optional(),
    is_public: z.boolean(),
})

export async function updateBook(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        return {
            errors: {
                message: ["You must be logged in to create or edit a recipe"]
            }
        }
    }

    const rawFormData = Object.fromEntries(formData);

    const formDataWithBoolean = {
        ...rawFormData,
        is_public: formData.get('is_public') === 'on',
    }

    const validatedFields = bookSchema.safeParse(formDataWithBoolean);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: `Missing Fields. Failed to update recipe book.`
        }
    }

    const { id, name, image_url, is_public } = validatedFields.data;

    await sql`
        UPDATE recipebooks
        SET name = ${name}, image_url = ${image_url || null}, is_public = ${is_public}
        WHERE id = ${id}
    `;

    revalidatePath(`/books/${id}`);
    return redirect(`/books/${id}`);
}
