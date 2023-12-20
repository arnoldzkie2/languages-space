import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import DownloadTable from '../../DownloadTable'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore'

const AgentHeader = () => {

    const session = useSession()

    const t = useTranslations('super-admin')

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    const { agents, selectedAgents } = useAdminAgentStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('agent.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {session.status !== 'loading' ?
                    <Link href={'/manage/agent/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('agent.create')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ?
                    <DownloadTable tables={agents} selectedTable={selectedAgents} />
                    : clientHeaderSkeleton}
            </ul>
        </nav>
    )
}

export default AgentHeader