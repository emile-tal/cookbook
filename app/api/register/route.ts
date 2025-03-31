'use server'

import { UserCredentials } from "@/app/lib/definitions";
import bcryptjs from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function register(email: string, password: string, username: string) {
    const hashedPassword = await bcryptjs.hash(password, 10);
    try {
        const emailExists = await sql<UserCredentials[]>`SELECT * FROM users WHERE email = ${email}`;
        if (emailExists.length > 0) {
            return { success: false, error: "Email already exists" };
        }

        const usernameExists = await sql<UserCredentials[]>`SELECT * FROM users WHERE username = ${username}`;
        if (usernameExists.length > 0) {
            return { success: false, error: "Username already exists" };
        }

        const user = await sql<UserCredentials[]>`INSERT INTO users (email, password, username) VALUES (${email}, ${hashedPassword}, ${username})`;
        return { success: true, user: user[0] };

    } catch (error) {
        return { success: false, error };
    }
}