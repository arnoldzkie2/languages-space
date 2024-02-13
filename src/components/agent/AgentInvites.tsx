/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import TruncateTextModal from '../global/TruncateTextModal'
import Success from '../global/Success'
import Err from '../global/Err'
import { Skeleton } from '../ui/skeleton'
import useAgentInvitesStore from '@/lib/state/agent/agentInvitesStore'
import { Client } from '@prisma/client'
import useAgentStore from '@/lib/state/agent/agentStore'

const AgentInvites: React.FC = () => {

    const [currentInvites, setCurrentInvites] = useState<Client[] | null>(null)

    const agent = useAgentStore(s => s.agent)
    const { getInvites, invites } = useAgentInvitesStore()
    const { skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const setPage = useGlobalStore(state => state.setPage)
    const { getCurrentData, currentPage } = useGlobalPaginationStore()

    useEffect(() => {
        setPage('invites')
        if (!invites && agent?.id) getInvites()
    }, [agent?.id])

    const t = useTranslations('client')
    const tt = useTranslations('global')

    useEffect(() => {
        setCurrentInvites(getCurrentData(invites))
    }, [currentPage, invites])

    return (
        <div className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='w-full border-b pb-1 mb-1 flex items-center gap-5'>
                <h1 className='text-foreground text-lg font-bold'>{t('profile.my-invites')}</h1>
                <a href="/main.png" download={'test.png'}>Test</a>
                <Success />
                <Err />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="p-3">{tt('username')}</th>
                            <th scope="col" className="p-3">{tt('name')}</th>
                            <th scope="col" className="p-3">{tt('gender')}</th>
                            <th scope="col" className="p-3">{tt('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvites && currentInvites.length > 0 ?
                            currentInvites.map(client => (
                                <tr className="bg-card border hover:bg-muted" key={client.id}>
                                    <td className='p-3'>
                                        <div className='h-5 text-xs md:text-sm w-36' onClick={() => openTruncateTextModal(client.username)}>
                                            {returnTruncateText(client.username, 13)}
                                        </div>
                                    </td>
                                    <td className='p-3'>
                                        {client.name && <div className='h-5 text-xs md:text-sm w-36' onClick={() => openTruncateTextModal(client.name || '')}>
                                            {returnTruncateText(client.name, 13)}
                                        </div>}
                                    </td>
                                    <td className="p-3">
                                        {client.gender &&
                                            <div className={`h-5 text-xs md:text-sm w-36 cursor-pointer`} onClick={() => openTruncateTextModal(client.gender || '')}>
                                                {returnTruncateText(client.gender || '', 15)}
                                            </div>
                                        }
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(client.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            currentInvites && currentInvites.length < 1 ?
                                <tr className='border bg-card'>
                                    <td className='w-full px-3 py-2'>
                                        {tt('no-data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item} className='bg-card border'>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody >
                </table >
            </div>
            <TruncateTextModal />
            <TablePagination data={currentInvites || []} />
        </div>
    )
}


export default AgentInvites