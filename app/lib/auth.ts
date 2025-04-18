import NextAuth from "next-auth";
import bcryptjs from "bcryptjs";
import { config } from "./auth/config";

const { auth } = NextAuth(config);

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user) {
        return null;
    }
    return session.user;
}

export function hashPassword(password: string) {
    return bcryptjs.hash(password, 10);
}