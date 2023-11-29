'use client'
import ClientHeader from '@/components/client/ClientHeader'
import { signIn, useSession } from 'next-auth/react'
import React from 'react'

const Page = () => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    return (
        <>
            <ClientHeader />
        </>
    )
}

export default Page