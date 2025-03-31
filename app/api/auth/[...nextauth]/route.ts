import NextAuth, { AuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import { UserCredentials } from "@/app/types/definitions"
import bcryptjs from "bcryptjs"
import postgres from "postgres"

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const authOptions: AuthOptions = {
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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            // Runs on login and when token is refreshed
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            // Runs when session is checked
            session.user.id = token.id as string;
            session.user.username = token.username as string;
            session.user.email = token.email as string;
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
