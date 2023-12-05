/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientHeader from '@/components/client/ClientHeader'
import ClientInfo from '@/components/client/ClientInfo'
import ClientProfile from '@/components/client/ClientProfile'
import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import axios from 'axios'
import { signIn, signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = () => {

    return (
        <>
            <ClientHeader />

            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientInfo />
            </div>
        </>
    )

}

export default Page