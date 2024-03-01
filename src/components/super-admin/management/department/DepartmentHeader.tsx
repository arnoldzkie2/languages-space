/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';

const DepartmentHeader: React.FC = ({ }) => {

    const openNewDepartment = useDepartmentStore(s => s.openNewDepartment)

    const session = useSession()

    const t = useTranslations()

    const skeleton = (
        <Skeleton className='w-40 h-5 rounded-3xl'></Skeleton>
    )

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('department.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {session.status !== 'loading' ?
                    <div onClick={openNewDepartment} className='flex items-center text-muted-foreground hover:text-primary justify-center w-40 cursor-pointer'>
                        <div>{t('department.create')}</div>
                    </div> : skeleton}
            </ul>
        </nav>
    );
};

export default DepartmentHeader;
