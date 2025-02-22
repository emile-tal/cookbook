import { ingredients, instructions, permissions, recipeBookRecipes, recipeBooks, recipes, users } from '../lib/seed-data';

import bcryptjs from 'bcryptjs'
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcryptjs.hash(user.password, 10);
            return sql`
        INSERT INTO users (id, username, email, password)
        VALUES (${user.id}, ${user.username}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
        }),
    );

    return insertedUsers;
}

async function seedRecipes() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
    CREATE TABLE IF NOT EXISTS recipes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,
      is_public BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const insertedRecipes = await Promise.all(
        recipes.map(
            (recipe) => sql`
        INSERT INTO recipes (id, user_id, title, description, image_url, is_public)
        VALUES (${recipe.id}, ${recipe.user_id}, ${recipe.title}, ${recipe.description}, ${recipe.image_url}, ${recipe.is_public})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    return insertedRecipes;
}

async function seedIngredients() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
    CREATE TABLE IF NOT EXISTS ingredients (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
      amount VARCHAR(255),
      ingredient VARCHAR(255) NOT NULL
    );
  `;

    const insertedIngredients = await Promise.all(
        ingredients.map(
            (ingredient) => sql`
        INSERT INTO ingredients (recipe_id, amount, ingredient)
        VALUES (${ingredient.recipe_id}, ${ingredient.amount}, ${ingredient.ingredient})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    return insertedIngredients;
}

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
            await seedUsers()
            await seedRecipes()
            await seedIngredients()
            await seedInstructions()
            await seedRecipeBooks()
            await seedRecipeBookRecipes()
            await seedPermissions()
            return { message: 'Database seeded successfully' }
        });

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
