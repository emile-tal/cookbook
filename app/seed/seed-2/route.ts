// import { instructions, permissions, recipeBookRecipes, recipeBooks } from '../seed-data';

// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function seedInstructions() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

//   await sql`
//     CREATE TABLE IF NOT EXISTS instructions (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
//       position INT NOT NULL,
//       instruction TEXT NOT NULL
//     );
//   `;

//   const insertedInstructions = await Promise.all(
//     instructions.map(
//       (instruction) => sql`
//         INSERT INTO instructions (recipe_id, position, instruction)
//         VALUES (${instruction.recipe_id}, ${instruction.position}, ${instruction.instruction})
//       `,
//     ),
//   );

//   return insertedInstructions;
// }

// async function seedRecipeBooks() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

//   await sql`
//     CREATE TABLE IF NOT EXISTS recipeBooks (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//       name VARCHAR(255) NOT NULL,
//       image_url TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   const insertedRecipeBooks = await Promise.all(
//     recipeBooks.map(
//       (recipeBook) => sql`
//         INSERT INTO recipeBooks (id, user_id, name, image_url)
//         VALUES (${recipeBook.id}, ${recipeBook.user_id}, ${recipeBook.name}, ${recipeBook.image_url})
//       `,
//     ),
//   );

//   return insertedRecipeBooks;
// }

// async function seedRecipeBookRecipes() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

//   await sql`
//     CREATE TABLE IF NOT EXISTS recipeBookRecipes (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       book_id UUID REFERENCES recipeBooks(id) ON DELETE CASCADE,
//       recipe_id UUID REFERENCES recipes(id)
//     );
//   `;

//   const insertedRecipeBookRecipes = await Promise.all(
//     recipeBookRecipes.map(
//       (recipeBookRecipe) => sql`
//         INSERT INTO recipeBookRecipes (book_id, recipe_id)
//         VALUES (${recipeBookRecipe.book_id}, ${recipeBookRecipe.recipe_id})
//       `,
//     ),
//   );

//   return insertedRecipeBookRecipes;
// }

// async function seedPermissions() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

//   await sql`
//     CREATE TABLE IF NOT EXISTS permissions (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       book_id UUID REFERENCES recipeBooks(id) ON DELETE CASCADE,
//       user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//       can_edit BOOLEAN DEFAULT FALSE
//     );
//   `;

//   const insertedPermissions = await Promise.all(
//     permissions.map(
//       (permission) => sql`
//         INSERT INTO permissions (book_id, user_id, can_edit)
//         VALUES (${permission.book_id}, ${permission.user_id}, ${permission.can_edit})
//       `,
//     ),
//   );

//   return insertedPermissions;
// }

// export async function GET() {
//   try {
//     const result = await sql.begin(async () => {
//       await seedInstructions()
//       await seedRecipeBooks()
//       await seedRecipeBookRecipes()
//       await seedPermissions()
//       return { message: 'Database seeded successfully' }
//     });

//     console.log(result)
//     return Response.json({ message: 'Database seeded successfully' });
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }
