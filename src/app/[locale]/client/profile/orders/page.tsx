/* eslint-disable react-hooks/exhaustive-deps */
import ClientHeader from '@/components/client/ClientHeader'
import ClientOrders from '@/components/client/ClientOrders'
import ClientProfile from '@/components/client/ClientProfile'
import { Order } from '@/lib/types/super-admin/orderType'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = () => {

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientOrders />
            </div>
        </>

    )
}

export default Page