'use client'
import Link from 'next/link';
import React from 'react';
import DownloadTable from '../DownloadTable';
import { useTranslations } from 'next-intl';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const SupplierHeader: React.FC = ({ }) => {

    const { supplier, selectedSupplier } = useAdminSupplierStore()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const t = useTranslations()

    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('supplier.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-4 text-muted-foreground'>
                {isAdminAllowed('view_supplier_payment_request') && <Link href='/admin/manage/supplier/payment-request' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('balance.payment.request')}</div>
                </Link>}
                {isAdminAllowed('create_supplier_earnings') && <Link href='/admin/manage/supplier/earnings' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('balance.earnings.h1')}</div>
                </Link>}
                {isAdminAllowed('create_supplier_deductions') && <Link href='/admin/manage/supplier/deductions' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('balance.deductions.h1')}</div>
                </Link>}
                {isAdminAllowed('create_supplier') && <Link href='/admin/manage/supplier/new' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('supplier.create')}</div>
                </Link>}

                <DownloadTable tables={supplier} selectedTable={selectedSupplier} />
            </ul>
        </nav>
    )
}

export default SupplierHeader
