'use client'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import { AgentBalanceTransactions } from '@prisma/client'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import useAgentBalanceStore from '@/lib/state/agent/agentBalanceStore'
import { Skeleton } from '../ui/skeleton'
import TruncateTextModal from '../global/TruncateTextModal'

const AgentBalanceTransactions = () => {

    const [currentTransactions, setCurrentTransactions] = useState<AgentBalanceTransactions[] | null>(null)

    const { skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const { transactions, getTransactions } = useAgentBalanceStore()
    const { currentPage, getCurrentData } = useGlobalPaginationStore()
    const t = useTranslations()

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
            <h1 className='text-foreground border-b mb-1 pb-1 text-lg font-bold'>{t('balance.transactions.h1')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{t('balance.amount')}</th>
                            <th scope="col" className="px-3 py-3">{t('status.h1')}</th>
                            <th scope="col" className="px-3 py-3">{t('balance.payment.address')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.paid_by')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.date.h1')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions && currentTransactions.length > 0 ?
                            currentTransactions.map(transac => (
                                <tr className="bg-card border hover:bg-muted hover:text-foreground" key={transac.id}>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-32'>
                                            {transac.amount}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {transac.status}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-32'>
                                            {returnTruncateText(transac.payment_address, 15)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {transac.paid_by && <div className='h-5 text-xs md:text-sm w-28 cursor-pointer' onClick={() => openTruncateTextModal(transac.paid_by || '')}>
                                            {returnTruncateText(transac.paid_by, 15)}
                                        </div>}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(transac.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            currentTransactions && currentTransactions.length < 1 ?
                                <tr>
                                    <td className='w-full px-3 py-2'>
                                        {t('global.no_data')}
                                    </td>
                                </tr>
                                :
                                skeleton.map(item => (
                                    <tr key={item} className='border bg-card'>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody >
                    <TruncateTextModal />
                </table >
            </div>
            <TablePagination data={transactions || []} />
        </div>
    )
}

export default AgentBalanceTransactions