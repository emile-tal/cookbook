import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import type { NextAuthConfig } from "next-auth";
import { Session } from "next-auth";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const config: NextAuthConfig = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (
                    typeof credentials?.email !== "string" ||
                    typeof credentials?.password !== "string"
                ) return null;

                const users = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
                const user = users[0];
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return { id: user.id, username: user.username, email: user.email };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token?.sub) session.user.id = token.sub;
            return session;
        },
    },
    pages: {
        signIn: "/login"
    }
};
