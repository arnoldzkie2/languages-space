'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

const RequestPaymentsHeader: React.FC = ({ }) => {
    const t = useTranslations()

    return (
        <nav className={`border-b h-20 flex items-center bg-card px-8 justify-between`}>
            <h1 className='font-black text-foreground text-xl uppercase'>{t('balance.payment.request')}</h1>
            <ul className='flex items-center h-full ml-auto gap-4'>
                <Link href='/admin/manage/supplier' className='flex items-center justify-center w-40 text-muted-foreground hover:text-primary cursor-pointer gap-1'>
                    <div>{t('supplier.manage')}</div>
                </Link>
            </ul>
        </nav>
    )
}

export default RequestPaymentsHeader
