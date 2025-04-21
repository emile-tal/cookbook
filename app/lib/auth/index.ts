import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { config } from "./config";
import sql from "../db";

const { auth } = NextAuth(config);

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user) {
        return null;
    }
    return session.user;
}

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export async function validatePassword(userId: string, password: string) {
    try {
        const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
        if (user.length === 0) {
            return false;
        }
        return await bcrypt.compare(password, user[0].password);
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
}

export async function updatePassword(userId: string, password: string) {
    try {
        await sql`UPDATE users SET password = ${password} WHERE id = ${userId}`;
        return { success: true };
    } catch (error) {
        console.error('Error updating password:', error);
        return { success: false };
    }
}