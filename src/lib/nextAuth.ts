import { NextAuthOptions, getServerSession } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

declare module "next-auth" {
    interface Session {
        user: {
            name: string | null
            email: string | null
            tags?: string[]
            sub: string
            id: string
            profile_url: string | null
            profile_key: string | null
            username: string
            phone_number: string | null
            payment_info?: string | null
            payment_schedule?: string | null
            gender: string | null
            organization: string | null
            password: string
            address: string | null
            origin: string | null
            note: string | null
            created_at: string
            updated_at: string
            type: string
            iat: number
            exp: number
            jti: string
        }
    }
}

const nextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Phone", type: "number", placeholder: "Phone Number" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },

            async authorize(credentials) {

                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`, credentials)

                if (!data) return null

                return data
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
        signIn: '/auth',
        error: '/error'
    },
} satisfies NextAuthOptions

const getAuth = (...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) => {
    return getServerSession(...args, nextAuthOptions)
}

export { nextAuthOptions, getAuth }