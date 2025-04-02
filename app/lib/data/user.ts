'use server'

import { User, UserCredentials } from "../../types/definitions";

import sql from '../db';

export async function isEmailUnique(email: string) {
    const emailExists = await sql<UserCredentials[]>`SELECT * FROM users WHERE email = ${email}`;
    if (emailExists.length > 0) {
        return false;
    }
    return true;
}

export async function isUsernameUnique(username: string) {
    const usernameExists = await sql<UserCredentials[]>`SELECT * FROM users WHERE username = ${username}`;
    if (usernameExists.length > 0) {
        return false;
    }
    return true;
}

export async function createUser(email: string, hashedPassword: string, username: string) {
    const user = await sql<UserCredentials[]>`INSERT INTO users (email, password, username) VALUES (${email}, ${hashedPassword}, ${username})`;
    return user[0];
}

export async function updateUsername(id: string, username: string) {
    try {
        await sql`UPDATE users SET username = ${username} WHERE id = ${id}`;
        return { success: true };
    } catch (error) {
        console.error('Error updating username:', error);
        return { success: false, error: 'Failed to update username' };
    }
}

export async function getUser(id: string) {
    const user = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
    return user[0] || null;
}