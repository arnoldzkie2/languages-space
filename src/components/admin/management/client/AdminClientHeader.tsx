/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import DownloadTable from '@/components/super-admin/management/DownloadTable';

const AdminClientHeader: React.FC = ({ }) => {

    const permissions = useAdminPageStore(s => s.permissions)
    const { clients, selectedClients } = useAdminClientStore()
    const t = useTranslations('super-admin')

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {permissions?.create_client &&
                    <Link href={'/admin/manage/client/new'} className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                        <div>{t('client.create')}</div>
                    </Link>}
                {permissions?.create_cards &&
                    <Link href={'/admin/manage/client/card/new'} className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                        <div>{t('client-card.create')}</div>
                    </Link>}
                {permissions?.view_cards && <Link href='/admin/manage/client/card' className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                    <div>{t('client-card.h1')}</div>
                </Link>}
                {permissions?.bind_cards && <li className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                    <Link href={'/admin/manage/client/card/bind'}>{t('client.card.bind')}</Link>
                </li>}
                {permissions?.download_table && <li className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                    <DownloadTable tables={clients} selectedTable={selectedClients} />
                </li>}
            </ul>
        </nav>
    );
};

export default AdminClientHeader;
