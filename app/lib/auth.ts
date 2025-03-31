import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcryptjs from "bcryptjs";
import { getServerSession } from "next-auth";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return null;
    }
    return session.user;
}

export function hashPassword(password: string) {
    return bcryptjs.hash(password, 10);
}