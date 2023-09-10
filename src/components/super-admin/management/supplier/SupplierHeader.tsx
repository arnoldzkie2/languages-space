'use client'
import Link from 'next-intl/link';
import React from 'react';
import DownloadTable from '../DownloadTable';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';

const SupplierHeader: React.FC = ({ }) => {

    const { status } = useSession()

    const { supplier, selectedSupplier} = useAdminSupplierStore()

    const t = useTranslations('super-admin')

    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('supplier.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {status !== 'loading' ? <Link href='/manage/supplier/new' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{t('supplier.create')}</div>
                </Link> : skeleton}
                {status !== 'loading' ? < DownloadTable tables={supplier} selectedTable={selectedSupplier} /> : skeleton}
            </ul>
        </nav>
    )
}

export default SupplierHeader;
