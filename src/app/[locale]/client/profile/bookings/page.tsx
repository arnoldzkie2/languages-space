'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import ClientBookings from '@/components/client/ClientBookings'
import ClientHeader from '@/components/client/ClientHeader'
import ClientProfile from '@/components/client/ClientProfile'
import RequestCancelBookingModal from '@/components/client/RequestCancelBookingModal'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import React from 'react'

const Page = () => {

    const requestCancelBooking = useClientBookingStore(s => s.requestCancelBooking)

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientBookings />
            </div>
            <RequestCancelBookingModal requestCancelBooking={requestCancelBooking} />
        </>

    )
}

export default Page