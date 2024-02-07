'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import CreateScheduleSheet from './CreateScheduleSheet';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const ScheduleHeader: React.FC = ({ }) => {

    const t = useTranslations('super-admin')

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    
    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('schedule.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {isAdminAllowed('create_supplier_schedule') && <CreateScheduleSheet />}
            </ul>
        </nav>
    )
}

export default ScheduleHeader;
