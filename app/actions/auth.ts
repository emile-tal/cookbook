'use server'

import { createUser, isEmailUnique, isUsernameUnique, updateUsername } from "@/app/lib/data/user";
import { getCurrentUser, hashPassword } from "../lib/auth";

export async function register(email: string, password: string, username: string) {
    const hashedPassword = await hashPassword(password);
    try {
        if (!await isEmailUnique(email)) {
            return { success: false, error: "Email already exists" };
        }

        if (!await isUsernameUnique(username)) {
            return { success: false, error: "Username already exists" };
        }

        const user = await createUser(email, hashedPassword, username);
        return { success: true, user };

    } catch (error) {
        return { success: false, error };
    }
}

export async function changeUsername(username: string) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: "User not found" };
        }

        if (!await isUsernameUnique(username)) {
            return { success: false, error: "Username already exists" };
        }

        await updateUsername(user.id, username);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}