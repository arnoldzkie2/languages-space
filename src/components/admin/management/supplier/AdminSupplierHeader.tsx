'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import DownloadTable from '@/components/super-admin/management/DownloadTable';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const AdminSUpplierHeader: React.FC = ({ }) => {

    const { supplier, selectedSupplier } = useAdminSupplierStore()
    const permissions = useAdminPageStore(s => s.permissions)
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('supplier.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-4'>
                {permissions?.view_supplier_payment_request && <Link href='/admin/manage/supplier/payment-request' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('payment-request')}</div>
                </Link>}
                {permissions?.create_supplier_earnings && <Link href='/admin/manage/supplier/earnings' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('earnings')}</div>
                </Link>}
                {permissions?.create_supplier_deductions && <Link href='/admin/manage/supplier/deductions' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{tt('deductions')}</div>
                </Link>}
                {permissions?.view_courses && <Link href='/admin/manage/supplier/courses' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{t('courses.h1')}</div>
                </Link>}
                {permissions?.create_supplier && <Link href='/admin/manage/supplier/new' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>{t('supplier.create')}</div>
                </Link>}

                {permissions?.download_table && < DownloadTable tables={supplier} selectedTable={selectedSupplier} />}
            </ul>
        </nav>
    )
}

export default AdminSUpplierHeader
