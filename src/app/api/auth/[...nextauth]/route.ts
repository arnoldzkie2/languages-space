import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                user_name: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const { data } = await axios.post(`${process.env.NEXTAUTH_URL}/api/login`, credentials)
                if (data) {
                    return data
                } else {
                    return null
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        }
    },
    pages: {
        signIn: '/login'
    },
})

export { handler as GET, handler as POST }