import NextAuth, { AuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import { UserCredentials } from "@/app/lib/definitions"
import bcryptjs from "bcryptjs"
import postgres from "postgres"

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // Find user by username
                const users = await sql<UserCredentials[]>`SELECT * FROM users WHERE email = ${credentials.email}`;
                const user = users[0];

                if (!user) throw new Error("Invalid credentials");

                // Compare password
                const isValid = await bcryptjs.compare(credentials.password, user.password);

                if (!isValid) throw new Error("Invalid credentials");

                // Return user object (no password)
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions as AuthOptions);
export { handler as GET, handler as POST }
