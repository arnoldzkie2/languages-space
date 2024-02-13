'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

const SupplierDeductionHeader: React.FC = ({ }) => {

    const t = useTranslations('super-admin')

    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-black  text-xl uppercase'>{t('supplier.deductions')}</h1>
            <ul className='flex items-center h-full ml-auto gap-4 text-muted-foreground'>
                <Link href='/admin/manage/supplier' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('supplier.h1')}</div>
                </Link>
            </ul>
        </nav>
    )
}

export default SupplierDeductionHeader
