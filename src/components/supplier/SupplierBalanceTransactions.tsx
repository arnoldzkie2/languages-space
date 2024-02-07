'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import { SupplierBalanceTransactions } from '@prisma/client'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import TruncateTextModal from '../global/TruncateTextModal'
import { Skeleton } from '../ui/skeleton'

const SupplierBalanceTransactions = () => {

    const [currentTransactions, setCurrentTransactions] = useState<SupplierBalanceTransactions[] | null>(null)

    const { skeleton } = useGlobalStore()
    const { transactions, getTransactions } = useSupplierBalanceStore()
    const { currentPage, getCurrentData } = useGlobalPaginationStore()
    const tt = useTranslations('global')
    const { returnTruncateText, copy, openTruncateTextModal } = useGlobalStore()

    useEffect(() => {
        if (!transactions) getTransactions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCurrentTransactions(getCurrentData(transactions))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, transactions])

    return (
        <div className='flex flex-col gap-3 w-full order-1 md:order-2'>
            <h1 className='text-foreground border-b mb-1 pb-1 text-lg font-bold'>{tt('transactions')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="px-3 py-3">ID</th>
                            <th scope="col" className="px-3 py-3">{tt('amount')}</th>
                            <th scope="col" className="px-3 py-3">{tt('status')}</th>
                            <th scope="col" className="px-3 py-3">{tt('payment')}</th>
                            <th scope="col" className="px-3 py-3">{tt('paid-by')}</th>
                            <th scope="col" className="px-3 py-3">{tt('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions && currentTransactions.length > 0 ?
                            currentTransactions.map(transac => (
                                <tr className="bg-card border hover:bg-muted" key={transac.id}>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-20 cursor-pointer' onClick={() => copy(transac.id)} title={tt('copy')}>
                                            {returnTruncateText(transac.id, 8)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-20'>
                                            {transac.amount}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-20'>
                                            {transac.status}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28 cursor-pointer'
                                            title={tt("view")}
                                            onClick={() => openTruncateTextModal(transac.payment_address)}>
                                            {returnTruncateText(transac.payment_address, 10)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {transac.paid_by &&
                                            <div className='h-5 text-xs md:text-sm w-32 cursor-pointer'
                                                title={tt("view")}
                                                onClick={() => openTruncateTextModal(transac.paid_by!)}>
                                                {returnTruncateText(transac.paid_by, 15)}
                                            </div>}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-36 md:text-sm cursor-pointer'
                                            onClick={() => openTruncateTextModal(new Date(transac.created_at).toLocaleString())}
                                            title={tt('view')}>
                                            {returnTruncateText(new Date(transac.created_at).toLocaleString(), 10)}
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            currentTransactions && currentTransactions.length < 1 ?
                                <tr className='border bg-card'>
                                    <td className='w-full px-3 py-2'>
                                        {tt('no-data')}
                                    </td>
                                </tr>
                                :
                                skeleton.map(item => (
                                    <tr key={item} className='border bg-card'>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-20 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-20 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-20 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody >
                </table >
                <TruncateTextModal />
            </div>
            <TablePagination data={transactions || []} />
        </div >
    )
}

export default SupplierBalanceTransactions