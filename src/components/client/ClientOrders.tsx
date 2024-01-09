/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import useClientStore from '@/lib/state/client/clientStore'
import TablePagination from './TablePagination'
import { Order } from '@/lib/types/super-admin/orderType'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'


const ClientOrders: React.FC = () => {

    const t = useTranslations('client')
    const tt = useTranslations('global')

    const [currentOrders, setCurrentOrders] = useState<Order[] | null>(null)

    const { orders, getClientOrders, client, setPage } = useClientStore()
    const skeleton = useGlobalStore(s => s.skeleton)
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
            <h1 className='text-blue-600 border-b mb-1 pb-1 text-lg font-bold'>{t('profile.my-orders')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-gray-800 shadow-md w-full">
                    <thead className="text-xs uppercase bg-slate-100 border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{tt('card')}</th>
                            <th scope="col" className="px-3 py-3">{tt('quantity')}</th>
                            <th scope="col" className="px-3 py-3">{tt('price')}</th>
                            <th scope="col" className="px-3 py-3">{tt('status')}</th>
                            <th scope="col" className="px-3 py-3">{tt('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders && currentOrders.length > 0 ?
                            currentOrders.map(order => (
                                <tr className="bg-white border hover:bg-slate-50" key={order.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {order.card.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-8'>
                                            {order.quantity}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-16'>
                                            ¥{order.price}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-16 uppercase'>
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
                                <tr>
                                    <td>
                                        {tt('no-data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item}>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-8 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-16 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-16 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody >
                </table >
            </div>
            <TablePagination data={orders || []} />
        </ul>
    )
}

export default ClientOrders