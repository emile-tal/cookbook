import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcryptjs from "bcryptjs"
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function hashPassword(password: string) {
    return bcryptjs.hash(password, 10);
}

export async function getAuthUser(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) throw new Error("Unauthorized");
    return token;
}