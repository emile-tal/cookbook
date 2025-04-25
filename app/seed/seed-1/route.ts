// import { ingredients, recipes, users } from '../seed-data';

// import bcryptjs from 'bcryptjs'
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function seedUsers() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//   await sql`
//     CREATE TABLE IF NOT EXISTS users (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       username VARCHAR(255) NOT NULL UNIQUE,
//       email TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   const insertedUsers = await Promise.all(
//     users.map(async (user) => {
//       const hashedPassword = await bcryptjs.hash(user.password, 10);
//       return sql`
//         INSERT INTO users (id, username, email, password)
//         VALUES (${user.id}, ${user.username}, ${user.email}, ${hashedPassword})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );

//   return insertedUsers;
// }

// async function seedRecipes() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//   await sql`
//     CREATE TABLE IF NOT EXISTS recipes (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//       title VARCHAR(255) NOT NULL,
//       description TEXT,
//       image_url TEXT,
//       is_public BOOLEAN DEFAULT TRUE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       category VARCHAR(255) NULL,
//       duration INTEGER NULL
//     );
//   `;

//   const insertedRecipes = await Promise.all(
//     recipes.map(
//       (recipe) => sql`
//         INSERT INTO recipes (id, user_id, title, description, image_url, is_public, category, duration)
//         VALUES (${recipe.id}, ${recipe.user_id}, ${recipe.title}, ${recipe.description}, ${recipe.image_url}, ${recipe.is_public}, ${recipe.category}, ${recipe.duration})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedRecipes;
// }

// async function seedIngredients() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//   await sql`
//     CREATE TABLE IF NOT EXISTS ingredients (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
//       amount VARCHAR(255),
//       ingredient VARCHAR(255) NOT NULL
//     );
//   `;

//   const insertedIngredients = await Promise.all(
//     ingredients.map(
//       (ingredient) => sql`
//         INSERT INTO ingredients (recipe_id, amount, ingredient)
//         VALUES (${ingredient.recipe_id}, ${ingredient.amount}, ${ingredient.ingredient})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedIngredients;
// }

// export async function GET() {
//   try {
//     const result = await sql.begin(async () => {
//       await seedUsers()
//       await seedRecipes()
//       await seedIngredients()
//       return { message: 'Database seeded successfully' }
//     });

//     console.log(result)
//     return Response.json({ message: 'Database seeded successfully' });
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }
