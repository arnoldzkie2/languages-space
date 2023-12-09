/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientHeader from '@/components/client/ClientHeader';
import useClientStore from '@/lib/state/client/clientStore';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

interface PageProps {
}

const Page: React.FC<PageProps> = ({ }) => {

    const { getClientCards, getClientBookings, getClientOrders, getAvailableCards } = useClientStore()

    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const getAllUserData = async () => {
        await Promise.all([
            getClientCards(), getClientBookings(), getClientOrders(), getAvailableCards()
        ])
    }

    useEffect(() => {

        if (status === 'authenticated' && session.user.type === 'client') {
            getAllUserData()
        }
    }, [session])

    return (

        <>
            <ClientHeader />
        </>
    )
}

export default Page
