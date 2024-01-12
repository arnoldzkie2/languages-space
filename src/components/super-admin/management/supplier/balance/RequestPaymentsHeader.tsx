'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

const RequestPaymentsHeader: React.FC = ({ }) => {

    const { status } = useSession()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('supplier.payment.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-4'>
                {status !== 'loading' ? <Link href='/manage/supplier/earnings' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('earnings')}</div>
                </Link> : skeleton}
                {status !== 'loading' ? <Link href='/manage/supplier/deductions' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('deductions')}</div>
                </Link> : skeleton}
                {status !== 'loading' ? <Link href='/manage/supplier' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{t('supplier.h1')}</div>
                </Link> : skeleton}
            </ul>
        </nav>
    )
}

export default RequestPaymentsHeader