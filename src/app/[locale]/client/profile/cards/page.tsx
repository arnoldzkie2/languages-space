/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientCards from '@/components/client/ClientCards'
import ClientHeader from '@/components/client/ClientHeader'
import ClientProfile from '@/components/client/ClientProfile'
import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const session: any = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const [cards, setCards] = useState<ClientCard[]>([])

    const retrieveClientCards = async () => {
        try {

            const { data } = await axios.get('/api/client/card', {
                params: { clientID: session.data.user.id }
            })

            if (data.ok) {
                setCards(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {

        if (session.status === 'authenticated' && session.data.user.type === 'client') {
            retrieveClientCards()
        }

    }, [session])

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientCards cards={cards} />
            </div>
        </>

    )
}

export default Page