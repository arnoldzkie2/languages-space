'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import { SupplierDeductions } from '@prisma/client'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import { Skeleton } from '../ui/skeleton'

const SupplierBalanceDeductions = () => {

    const [currentDeductions, setCurrentDeductions] = useState<SupplierDeductions[] | null>(null)

    const { skeleton } = useGlobalStore()
    const { deductions, getDeductions } = useSupplierBalanceStore()
    const { currentPage, getCurrentData } = useGlobalPaginationStore()
    const t = useTranslations()

    useEffect(() => {
        if (!deductions) getDeductions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCurrentDeductions(getCurrentData(deductions))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, deductions])

    return (
        <div className='flex flex-col gap-3 w-full order-1 md:order-2'>
            <h1 className='text-foreground border-b mb-1 pb-1 text-lg font-bold'>{t('balance.deductions.h1')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{t('info.name')}</th>
                            <th scope="col" className="px-3 py-3">{t('balance.amount')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.rate')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.quantity')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.date.h1')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDeductions && currentDeductions.length > 0 ?
                            currentDeductions.map(obj => (
                                <tr className="bg-card border hover:bg-muted" key={obj.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {obj.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {Number(obj.amount)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {Number(obj.rate)}
                                        </div>
                                    </td>

                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {obj.quantity}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(obj.created_at).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            currentDeductions && currentDeductions.length < 1 ?
                                <tr className='border bg-card'>
                                    <td className='w-full px-3 py-2'>
                                        {t('global.no_data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item} className='border bg-card'>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
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
                    </tbody >
                </table >
            </div>
            <TablePagination data={deductions || []} />
        </div>
    )
}

export default SupplierBalanceDeductions