/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import AvailableSuppliers from '@/components/client/AvailableSuppliers'
import ClientBookingModal from '@/components/client/BookSupplierModal'
import ClientHeader from '@/components/client/ClientHeader'
import useClientStore from '@/lib/state/client/clientStore'
import React from 'react'

const Page = () => {

    const { isBooking } = useClientStore()


    return (
        <>
            <ClientHeader />
            <AvailableSuppliers />
            {isBooking && <ClientBookingModal />}
        </>
    )

}

export default Page