import type { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        username?: string;
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            username?: string;
            email?: string | null;
        };
    }

    interface User extends DefaultUser {
        username?: string;
    }
}