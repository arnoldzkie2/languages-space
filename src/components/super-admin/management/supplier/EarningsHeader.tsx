'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const SupplierEarningsHeader: React.FC = ({ }) => {

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('supplier.earnings')}</h1>
            <ul className='flex items-center text-muted-foreground h-full ml-auto gap-4'>
                {isAdminAllowed('create_supplier_deductions') && <Link href='/admin/manage/supplier/deductions' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{tt('deductions')}</div>
                </Link>}
                <Link href='/admin/manage/supplier' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('supplier.h1')}</div>
                </Link>
            </ul>
        </nav>
    )
}

export default SupplierEarningsHeader
