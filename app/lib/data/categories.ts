'use server'

import sql from '../db';

export async function fetchCategories() {
    try {
        const categoriesResult: { category: string }[] = await sql`SELECT DISTINCT category FROM recipecategories`;
        return categoriesResult.map((category) => category.category);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function addCategory(category: string) {
    try {
        await sql`INSERT INTO categories (category) VALUES (${category})`;
    } catch (error) {
        console.error('Error adding category:', error);
    }
}