'use client'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import DownloadTable from '../DownloadTable'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const AgentHeader = () => {

    const t = useTranslations()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const { agents, selectedAgents } = useAdminAgentStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('agent.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                {isAdminAllowed('create_agent') &&
                    <Link href={'/admin/manage/agent/new'} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('agent.create')}</div>
                    </Link>}
                {isAdminAllowed('create_agent_earnings') && <Link href='/admin/manage/agent/earnings' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('balance.earnings.h1')}</div>
                </Link>}
                {isAdminAllowed('create_agent_deductions') && <Link href='/admin/manage/agent/deductions' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('balance.deductions.h1')}</div>
                </Link>}
                <DownloadTable tables={agents} selectedTable={selectedAgents} />
            </ul>
        </nav>
    )
}

export default AgentHeader