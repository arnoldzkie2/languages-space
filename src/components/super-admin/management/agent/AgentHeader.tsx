'use client'
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import DownloadTable from '../DownloadTable'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore'

const AgentHeader = () => {

    const { status } = useSession()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    const { agents, selectedAgents } = useAdminAgentStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('agent.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {status !== 'loading' ?
                    <Link href={'/manage/agent/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('agent.create')}</div>
                    </Link> : skeleton}
                {status !== 'loading' ? <Link href='/manage/agent/earnings' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('earnings')}</div>
                </Link> : skeleton}
                {status !== 'loading' ? <Link href='/manage/agent/deductions' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('deductions')}</div>
                </Link> : skeleton}
                {status !== 'loading' ?
                    <DownloadTable tables={agents} selectedTable={selectedAgents} />
                    : skeleton}
            </ul>
        </nav>
    )
}

export default AgentHeader