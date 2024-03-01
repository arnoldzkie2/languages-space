/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import OrderForm from '@/components/super-admin/management/order/OrderForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { newOrderFormValue } from '@/lib/state/super-admin/orderStore'
import { OrderFormValue } from '@/lib/types/super-admin/orderType'
import { ADMIN } from '@/utils/constants'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const router = useRouter()
    const t = useTranslations()


    const [formData, setFormData] = useState<OrderFormValue>(newOrderFormValue)
    const departmentID = useDepartmentStore(s => s.departmentID)

    const { isSideNavOpen, setIsLoading, setErr } = useGlobalStore()
    const { cards, getCards } = useAdminCardStore()
    const { getClients, clients } = useAdminClientStore()

    const createOrder = async (e: any) => {
        e.preventDefault()
        try {

            const { quantity, name, express_number, note, invoice_number, selectedClientID, status, selectedCardID, price } = formData
            if (!Number(quantity)) return setErr('Quantity must be positive number')
            if (!selectedCardID) return setErr('Select Card')
            if (!selectedClientID) return setErr('Select Client')
            if (!price) return setErr("Price is required")

            setIsLoading(true)
            const { data } = await axios.post('/api/orders', {
                quantity: Number(quantity), name, express_number, price,
                note, invoice_number, operator: ADMIN, status, cardID: selectedCardID, clientID: selectedClientID
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! order created.")
                router.push('/admin/manage/orders')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            return setErr('Something went wrong')
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData, [name]: value
        }))
    };

    useEffect(() => {
        getClients()
        getCards()
    }, [departmentID])

    const clientHeaderSkeleton = (
        <Skeleton className='bw-32 h-5 rounded-3xl'></Skeleton>
    )

    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('order.create')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                        {session.status !== 'loading' ? <Link href={'/admin/manage/order'} className='flex items-center gap-1 justify-center w-32 hover:text-primary cursor-pointer'>
                            <div>{t('order.manage')}</div>
                        </Link> : clientHeaderSkeleton}
                    </ul>
                </nav>
                <div className='w-full px-8'>
                    <Card className='w-1/3'>
                        <CardHeader>
                            <CardTitle>{t('order.create')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='w-full flex flex-col gap-10' onSubmit={createOrder}>
                                <OrderForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    clients={clients}
                                    cards={cards}
                                    setFormData={setFormData}

                                />
                                <div className='flex items-center gap-10 w-1/2 self-end'>
                                    <Button className='w-full' variant={'ghost'} type='button' onClick={() => router.push('/admin/manage/orders')}>{t('operation.cancel')}</Button>
                                    <SubmitButton msg={t('operation.create')} style='w-full' />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page