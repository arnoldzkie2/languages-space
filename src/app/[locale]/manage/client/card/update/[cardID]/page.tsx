/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { OurFileRouter } from '@/app/api/uploadthing/core'
import SideNav from '@/components/super-admin/SideNav'
import { clientCardValue } from '@/lib/state/super-admin/clientCardStore'
import { newClientFormValue } from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { ClientFormData } from '@/lib/types/super-admin/clientType'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploadButton } from '@uploadthing/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        cardID: string
    }
}

const Page: React.FC<Props> = ({ params }) => {

    const { cardID } = params

    const router = useRouter()

    const session = useSession()

    const [formData, setFormData] = useState(clientCardValue)

    const t = useTranslations('super-admin')

    const { isSideNavOpen, departments, getDepartments } = useAdminGlobalStore()

    const [isLoading, setIsLoading] = useState(false)

    const [err, setErr] = useState('')

    const updateCard = async (e: any) => {

        e.preventDefault()

        const { balance, price } = formData

        if (price < 1) return alert('Price must be greater than 0')

        if (balance < 1) return alert('Balance must be greater than 0')

        try {

            setIsLoading(true)

            const { name, price, balance, online_purchases, online_renews, invoice, validity, repeat_purchases, settlement_period } = formData
            
            const { data } = await axios.patch(`/api/client/card-list?clientCardID=${cardID}`, formData)

            if (data.ok) {

                setIsLoading(false)

                router.push('/manage/client/card')

            }

        } catch (error: any) {

            setIsLoading(false)

            console.log(error);

            if (error.response.data.msg === 'client_card_name_exist') return setErr('Card name already exist!')

            return setErr('Something went wrong')

        }

    }

    const getCard = async () => {

        try {

            const { data } = await axios.get(`/api/client/card-list?clientCardID=${cardID}`)

            if (data.ok) setFormData(data.data)

        } catch (error) {

            console.log(error);

            alert('Something went wrong.')

        }
    }

    const handleChange = (e: any) => {

        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {

            setFormData((prevData) => ({
                ...prevData,
                [name]: checked
            }))

        } else {

            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

    }

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 w-32 h-5 rounded-3xl animate-pulse'></li>
    )

    console.log(formData);


    useEffect(() => {

        getCard()

    }, [])

    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client-card.create')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {session.status !== 'loading' ?
                            <Link href={'/manage/client'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('client.h1')}</div>
                            </Link> : clientHeaderSkeleton}
                        {session.status !== 'loading' ?
                            <Link href={'/manage/client/card'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('client-card.h1')}</div>
                            </Link> : clientHeaderSkeleton}
                        {session.status !== 'loading' ? <li className='flex items-center gap-1 text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer'>
                            <div>{t('client.card.bind')}</div>
                        </li> : clientHeaderSkeleton}
                    </ul>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-1/3 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={updateCard}>
                        {err && <small className='w-full text-red-400'>{err}</small>}
                        <div className='w-full flex gap-10'>

                            <div className='w-1/2 flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="name" className='font-medium px-2'>Name</label>
                                    <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none py-1 px-3' id='name' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="price" className='font-medium px-2'>Price</label>
                                    <input required value={formData.price} onChange={handleChange} name='price' type="number" className=' w-full border outline-none py-1 px-3' id='price' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="balance" className='font-medium px-2'>Balance</label>
                                    <input value={formData.balance} onChange={handleChange} name='balance' type="number" className='w-full border outline-none py-1 px-3' id='balance' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="validity" className='font-medium px-2'>Validity</label>
                                    <input required value={formData.validity} onChange={handleChange} name='validity' type="date" className='w-full border outline-none py-1 px-3' id='validity' />
                                </div>

                            </div>
                            <div className='w-1/2 flex flex-col gap-4'>

                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="invoice" className='font-medium'>Invoice</label>
                                    <input checked={formData.invoice} onChange={handleChange} name='invoice' type="checkbox" className='border outline-none py-1 px-3' id='invoice' />
                                </div>

                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="repeat_purchases" className='font-medium'>Repeat Purchases</label>
                                    <input checked={formData.repeat_purchases} onChange={handleChange} name='repeat_purchases' type="checkbox" className=' border outline-none py-1 px-3' id='repeat_purchases' />
                                </div>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="online_renews" className='font-medium'>Online Renews</label>
                                    <input checked={formData.online_renews} onChange={handleChange} name='online_renews' type="checkbox" className=' border outline-none py-1 px-3' id='online_renews' />
                                </div>

                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="online_purchases" className='font-medium'>Online Purchases</label>
                                    <input checked={formData.online_purchases} onChange={handleChange} name='online_purchases' type="checkbox" className='border outline-none py-1 px-3' id='online_purchases' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="settlement_period" className='font-medium'>Settlement Period</label>
                                    <input required value={formData.settlement_period} onChange={handleChange} name='settlement_period' type="date" className='border outline-none py-1 px-3' id='settlement_period' />
                                </div>

                            </div>

                        </div>
                        <div className='flex items-center gap-10 w-full'>
                            <Link href={'/manage/client/card'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>Cancel</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : 'Update'}</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Page