// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { config } from "@/app/lib/auth/config";

const { handlers } = NextAuth(config);
export const { GET, POST } = handlers;