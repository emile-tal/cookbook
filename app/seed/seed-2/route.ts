import { instructions, permissions, recipeBookRecipes, recipeBooks } from '../../lib/seed-data';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedInstructions() {
    await sql`
    CREATE TABLE IF NOT EXISTS instructions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
      order INT NOT NULL,
      instruction TEXT NOT NULL
    );
  `;

    const insertedInstructions = await Promise.all(
        instructions.map(
            (instruction) => sql`
        INSERT INTO instructions (recipe_id, order, instruction)
        VALUES (${instruction.recipe_id}, ${instruction.order}, ${instruction.instruction})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    return insertedInstructions;
}

async function seedRecipeBooks() {
    await sql`
    CREATE TABLE IF NOT EXISTS recipeBooks (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const insertedRecipeBooks = await Promise.all(
        recipeBooks.map(
            (recipeBook) => sql`
        INSERT INTO recipeBooks (id, user_id, name)
        VALUES (${recipeBook.id}, ${recipeBook.user_id}, ${recipeBook.name})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    return insertedRecipeBooks;
}

async function seedRecipeBookRecipes() {
    await sql`
    CREATE TABLE IF NOT EXISTS recipeBookRecipes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      book_id UUID REFERENCES recipeBooks(id) ON DELETE CASCADE,
      recipe_id UUID REFERENCES recipes(id)
    );
  `;

    const insertedRecipeBookRecipes = await Promise.all(
        recipeBookRecipes.map(
            (recipeBookRecipe) => sql`
        INSERT INTO recipeBookRecipes (book_id, recipe_id)
        VALUES (${recipeBookRecipe.book_id}, ${recipeBookRecipe.recipe_id})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    return insertedRecipeBookRecipes;
}

async function seedPermissions() {
    await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      book_id UUID REFERENCES recipeBooks(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      can_edit BOOLEAN DEFAULT FALSE
    );
  `;

    const insertedPermissions = await Promise.all(
        permissions.map(
            (permission) => sql`
        INSERT INTO permissions (book_id, user_id, can_edit)
        VALUES (${permission.book_id}, ${permission.user_id}, ${permission.can_edit})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    return insertedPermissions;
}

export async function GET() {
    try {
        const result = await sql.begin(async () => {
            await seedInstructions()
            await seedRecipeBooks()
            await seedRecipeBookRecipes()
            await seedPermissions()
            return { message: 'Database seeded successfully' }
        });

        console.log(result)
        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
