/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useGlobalStore from '@/lib/state/globalStore';

const DepartmentHeader: React.FC = ({ }) => {

    const { toggleNewDepartment } = useGlobalStore()

    const session = useSession()

    const t = useTranslations('super-admin')

    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('department.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {session.status !== 'loading' ?
                    <div onClick={toggleNewDepartment} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer'>
                        <div>{t('department.create')}</div>
                    </div> : skeleton}
            </ul>
        </nav>
    );
};

export default DepartmentHeader;
