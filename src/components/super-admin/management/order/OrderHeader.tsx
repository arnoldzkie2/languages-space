/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Link from 'next/link';
import React from 'react';
import DownloadTable from '../DownloadTable';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useAdminOrderStore from '@/lib/state/super-admin/orderStore';
import { Skeleton } from '@/components/ui/skeleton';

const OrderHeader: React.FC = ({ }) => {

    const session = useSession()

    const { orders, selectedOrder } = useAdminOrderStore()

    const t = useTranslations('super-admin')

    const skeleton = (
        <Skeleton className='w-28 h-5 rounded-3xl'></Skeleton>
    )

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('order.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                {session.status !== 'loading' ?
                    <Link href={'/admin/manage/orders/new'} className='flex items-center hover:text-primary justify-center w-28 cursor-pointer'>
                        <div>{t('order.create')}</div>
                    </Link> : skeleton}
                {session.status !== 'loading' ? <DownloadTable tables={orders} selectedTable={selectedOrder} /> : skeleton}
            </ul>
        </nav>
    );
};

export default OrderHeader;
