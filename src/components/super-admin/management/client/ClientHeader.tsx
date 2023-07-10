'use client'
import { newOrUpdateClient } from '@/lib/redux/ManageClient/ManageClientSlice';
import { faAddressCard, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import DownloadTable from '../DownloadTable';
import { useTranslations } from 'next-intl';

const ClientHeader: React.FC = ({ }) => {

    const dispatch = useDispatch()

    const { clients, selectedClients } = useSelector((state: RootState) => state.manageClient)

    const t = useTranslations('client')

    return (
        <nav className={`border shadow flex items-center py-5 px-10 justify-between bg-white`}>
            <h1 className='font-bold text-gray-600 text-xl uppercase'>{t('h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-10'>
                <li className='flex items-center text-gray-700 hover:text-blue-600 cursor-pointer gap-1' onClick={() => dispatch(newOrUpdateClient({ type: 'new' }))}>
                    <div>{t('create')}</div>
                    <FontAwesomeIcon icon={faPlus} />
                </li>

                <DownloadTable tables={clients} selectedTable={selectedClients} />

                <Link href='/manage/client/card' className='flex items-center gap-1 text-gray-700 hover:text-blue-600 cursor-pointer'>
                    <div>{t('card.client')}</div>
                    <FontAwesomeIcon icon={faAddressCard} />
                </Link>
                <li className='flex items-center gap-1 text-gray-700 hover:text-blue-600 cursor-pointer'>
                    <div>{t('card.bind')}</div>
                    <FontAwesomeIcon icon={faSquarePlus} />
                </li>
            </ul>
        </nav>
    );
};

export default ClientHeader;
