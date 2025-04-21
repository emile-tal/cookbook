'use server'

import { createUser, isEmailUnique, isUsernameUnique, updateUsername } from "@/app/lib/data/user";
import { getCurrentUser, hashPassword, updatePassword, validatePassword } from "@/app/lib/auth";

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

export async function changePassword(oldPassword: string, newPassword: string) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const isValid = await validatePassword(user.id, oldPassword);
        if (!isValid) {
            return { success: false, error: "Invalid old password" };
        }

        const hashedPassword = await hashPassword(newPassword);
        await updatePassword(user.id, hashedPassword);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}