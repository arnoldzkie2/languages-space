/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import useClientStore from '@/lib/state/client/clientStore'
import TablePagination from './TablePagination'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import { Order } from '@prisma/client'
import { Skeleton } from '../ui/skeleton'
import TruncateTextModal from '../global/TruncateTextModal'


const ClientOrders: React.FC = () => {

    const t = useTranslations()

    const [currentOrders, setCurrentOrders] = useState<Order[] | null>(null)

    const { orders, getClientOrders, client, setPage } = useClientStore()
    const { skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const { getCurrentData, currentPage } = useGlobalPaginationStore()

    useEffect(() => {

        setPage('orders')
        if (!orders && client?.id) getClientOrders()

    }, [client?.id])

    useEffect(() => {
        setCurrentOrders(getCurrentData(orders))
    }, [currentPage, orders])

    return (
        <ul className='flex flex-col gap-3 w-full md:w-2/3 xl:w-1/2 order-1 md:order-2'>
            <h1 className='text-foreground border-b mb-1 pb-1 text-lg font-bold'>{t('profile.orders')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{t('side_nav.card')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.quantity')}</th>
                            <th scope="col" className="px-3 py-3">{t('card.price')}</th>
                            <th scope="col" className="px-3 py-3">{t('status.h1')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.date.h1')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders && currentOrders.length > 0 ?
                            currentOrders.map(order => (
                                <tr className="bg-card border hover:bg-muted" key={order.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36 cursor-pointer' onClick={() => openTruncateTextModal(order.name)}>
                                            {returnTruncateText(order.name, 15)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-10'>
                                            {order.quantity}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-16'>
                                            ¥{Number(order.price)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24 uppercase'>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(order.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            )) : currentOrders && currentOrders.length < 1 ?
                                <tr className='border bg-card'>
                                    <td className='p-3'>
                                        {t('global.no_data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item} className='bg-card border'>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-16 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                    <TruncateTextModal />
                </table >
            </div>
            <TablePagination data={orders || []} />
        </ul>
    )
}

export default ClientOrders