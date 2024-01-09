'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import { SupplierEarnings } from '@prisma/client'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'

const SupplierBalanceEarnings = () => {

    const { skeleton } = useGlobalStore()
    const { earnings, getEarnings } = useSupplierBalanceStore()
    const { currentPage, getCurrentData } = useGlobalPaginationStore()
    const [currentEarnings, setCurrentEarnings] = useState<SupplierEarnings[] | null>(null)

    const tt = useTranslations('global')

    useEffect(() => {
        if (!earnings) getEarnings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCurrentEarnings(getCurrentData(earnings))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, earnings])

    return (
        <div className='flex flex-col gap-3 w-full order-1 md:order-2'>
            <h1 className='text-blue-600 border-b mb-1 pb-1 text-lg font-bold'>{tt('earnings')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-gray-800 shadow-md w-full">
                    <thead className="text-xs uppercase bg-slate-100 border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{tt('name')}</th>
                            <th scope="col" className="px-3 py-3">{tt('amount')}</th>
                            <th scope="col" className="px-3 py-3">{tt('rate')}</th>
                            <th scope="col" className="px-3 py-3">{tt('quantity')}</th>
                            <th scope="col" className="px-3 py-3">{tt('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEarnings && currentEarnings.length > 0 ?
                            currentEarnings.map(obj => (
                                <tr className="bg-white border hover:bg-slate-50" key={obj.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {obj.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {obj.amount}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {obj.rate}
                                        </div>
                                    </td>

                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {obj.quantity}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(obj.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            currentEarnings && currentEarnings.length < 1 ?
                                <tr>
                                    <td className='w-full px-3 py-2'>
                                        {tt('no-data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item}>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
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
            <TablePagination data={earnings || []} />
        </div>
    )
}

export default SupplierBalanceEarnings