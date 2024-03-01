/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import DownloadTable from '../DownloadTable';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const ClientHeader: React.FC = ({ }) => {

    const t = useTranslations('')
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const { clients, selectedClients } = useAdminClientStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('client.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                {isAdminAllowed('create_client') &&
                    <Link href={'/admin/manage/client/new'} className='flex items-center justify-center w-28 hover:text-primary cursor-pointer'>
                        <div>{t('client.create')}</div>
                    </Link>}
                <DownloadTable tables={clients} selectedTable={selectedClients} />
            </ul>
        </nav>
    );
};

export default ClientHeader;
