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