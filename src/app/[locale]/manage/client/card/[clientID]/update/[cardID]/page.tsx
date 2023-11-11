/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import ClientHeader from '@/components/super-admin/management/client/ClientHeader'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        cardID: string
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const router = useRouter()

    const { isSideNavOpen, isLoading, setIsLoading } = useAdminGlobalStore()

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        balance: '',
        validity: ''
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const tt = useTranslations('global')
    const t = useTranslations('super-admin')

    const updateCard = async (e: any) => {

        e.preventDefault()

        const { name, price, balance, validity } = formData

        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/client/card', { name, price: Number(price), balance: Number(balance), validity }, {
                params: {
                    cardID: params.cardID
                }
            })

            if (data.ok) {
                setIsLoading(false)
                router.push(`/manage/client/card/${params.clientID}`)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const retrieveCard = async () => {
        try {

            const { data } = await axios.get('/api/client/card', {
                params: {
                    cardID: params.cardID
                }
            })

            if (data.ok) {
                setFormData(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }

    }

    useEffect(() => {
        retrieveCard()
    }, [])

    return (
        <div className='h-screen' >
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <ClientHeader />
                <div className='w-full px-8'>

                    <form className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={updateCard}>
                        <div className='w-full flex gap-10'>
                            <div className='w-1/2 flex flex-col gap-4'>
                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="name" className='font-medium px-2'>{t('client-card.name')}</label>
                                    <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none py-1 px-3' id='name' />
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="price" className='font-medium px-2'>{t('client-card.price')}</label>
                                    <input required value={formData.price} onChange={handleChange} name='price' type="number" className=' w-full border outline-none py-1 px-3' id='price' />
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="balance" className='font-medium px-2'>{t('client-card.balance')}</label>
                                    <input value={formData.balance} onChange={handleChange} name='balance' type="number" className='w-full border outline-none py-1 px-3' id='balance' />
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="validity" className='font-medium px-2'>{t('client-card.validity')}</label>
                                    <input required value={formData.validity} onChange={handleChange} name='validity' type="date" className='w-full border outline-none py-1 px-3' id='validity' />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-10 w-full'>
                            <Link href={`/manage/client/card/${params.clientID}`} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>{isLoading ?
                                <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('update')}</button>
                        </div>

                    </form>

                </div>
            </div>
        </div >
    )
}

export default Page