/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientBookings from '@/components/client/ClientBookings'
import ClientHeader from '@/components/client/ClientHeader'
import ClientProfile from '@/components/client/ClientProfile'
import { Booking } from '@/lib/types/super-admin/bookingType'
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

    const [bookings, setOrders] = useState<Booking[]>([])

    const getClientOrders = async () => {
        try {

            const { data } = await axios.get('/api/booking', {
                params: { clientID: session.data.user.id }
            })

            if (data.ok) {
                setOrders(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {

        if (session.status === 'authenticated' && session.data.user.type === 'client') {
            getClientOrders()
        }

    }, [session])

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientBookings bookings={bookings} />
            </div>
        </>

    )
}

export default Page