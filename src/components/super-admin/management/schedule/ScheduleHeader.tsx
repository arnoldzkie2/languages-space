'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore';

const ScheduleHeader: React.FC = ({ }) => {

    const { status } = useSession()

    const t = useTranslations('super-admin')

    const { toggleSchedule } = useAdminScheduleStore()
    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('schedule.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {status !== 'loading' ?
                    <li onClick={() => toggleSchedule()} className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('schedule.create')}</div>
                    </li> : skeleton}
            </ul>
        </nav>
    )
}

export default ScheduleHeader;
