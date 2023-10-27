/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next-intl/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

const ClientHeader: React.FC = ({ }) => {

    const session = useSession()

    const t = useTranslations('super-admin')

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 animate-pulse w-28 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client-card.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {session.status !== 'loading' ?
                    <Link href={'/manage/client/new'} className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                        <div>{t('client.create')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ?
                    <Link href={'/manage/client/card/new'} className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                        <div>{t('client-card.create')}</div>
                    </Link> : clientHeaderSkeleton}

                {session.status !== 'loading' ? <Link href='/manage/client/card' className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                    <div>{t('client-card.h1')}</div>
                </Link> : clientHeaderSkeleton}

                {session.status !== 'loading' ? <li className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                    <Link href={'/manage/client/card/bind'}>{t('client.card.bind')}</Link>
                </li> : clientHeaderSkeleton}
            </ul>
        </nav>
    );
};

export default ClientHeader;
