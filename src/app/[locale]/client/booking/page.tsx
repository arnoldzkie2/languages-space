/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import AvailableSuppliers from '@/components/client/AvailableSuppliers'
import ClientBookingModal from '@/components/client/ClientBookingModal'
import ClientBookingRequestModal from '@/components/client/ClientBookingRequestModal'
import ClientHeader from '@/components/client/ClientHeader'
import React from 'react'

const Page = () => {


    return (
        <>
            <ClientHeader />
            <AvailableSuppliers />
            <ClientBookingModal />
            <ClientBookingRequestModal />
        </>
    )

}

export default Page