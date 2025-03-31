'use server'

import { UserCredentials } from "@/app/lib/definitions";
import bcryptjs from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function register(email: string, password: string, username: string) {
    const hashedPassword = await bcryptjs.hash(password, 10);

    try {
        const user = await sql<UserCredentials[]>`INSERT INTO users (email, password, username) VALUES (${email}, ${hashedPassword}, ${username})`;
        return user[0];
    } catch (error) {
        console.error(error);
        return { error: "Failed to register" };
    }
}