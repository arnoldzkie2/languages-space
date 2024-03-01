'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

const AgentEarningsHeader: React.FC = ({ }) => {

    const t = useTranslations('')

    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-black  text-xl uppercase'>{t('agent.earnings')}</h1>
            <ul className='flex items-center h-full ml-auto gap-4 text-muted-foreground'>
                <Link href='/admin/manage/agent' className='flex hover:text-primary items-center justify-center w-40  hover:-primary cursor-pointer gap-1'>
                    <div>{t('agent.manage')}</div>
                </Link>
            </ul>
        </nav>
    )
}

export default AgentEarningsHeader
