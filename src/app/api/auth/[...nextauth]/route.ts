import { nextAuthOptions } from "@/lib/nextAuth";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }