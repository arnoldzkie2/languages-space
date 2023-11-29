/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientHeader from '@/components/client/ClientHeader'
import ClientInfo from '@/components/client/ClientInfo'
import ClientProfile from '@/components/client/ClientProfile'
import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
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

    const { setIsLoading, setOkMsg, setErr } = useAdminGlobalStore()
    const { client, setClient } = useClientStore()

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setClient({ ...client, [name]: value })
    }

    const updateClient = async (e: any) => {
        e.preventDefault()
        try {

            const { name, email, phone_number, gender, address, username } = client

            if (!username) return setErr('Username is required')

            setIsLoading(true)
            const { data } = await axios.patch('/api/client', {
                name, email, phone_number, gender, address
            }, { params: { clientID: session.data.user.id } })

            if (data.ok) {
                setIsLoading(false)
                retrieveClient()
                setOkMsg('Success')
                setTimeout(() => {
                    setOkMsg('')
                }, 3000);
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                setTimeout(() => {
                    setErr('')
                }, 5000)
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const retrieveClient = async () => {
        try {

            const { data } = await axios.get('/api/client', { params: { clientID: session.data.user.id } })

            if (data.ok) {
                setClient(data.data)
            }

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    useEffect(() => {
        if (session.status === 'authenticated' && session.data.user.id) {
            retrieveClient()
        }
    }, [session])

    return (
        <>
            <ClientHeader />

            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientInfo updateClient={updateClient} handleChange={handleChange} />
            </div>
        </>
    )

}

export default Page