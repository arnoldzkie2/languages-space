'use client'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next-intl/link';
import React from 'react';
import DownloadTable from '../DownloadTable';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useAdminNewsStore from '@/lib/state/super-admin/newsStore';

const NewsHeader: React.FC = ({ }) => {

    const { status } = useSession()

    const { news, selectedNews } = useAdminNewsStore()

    const t = useTranslations('super-admin')

    const newsHeaderSkeleton = (
        <li className='bg-slate-200 animate-pulse w-32 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
            <h1 className='font-bold text-gray-600 text-xl uppercase'>{t('news.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {status !== 'loading' ? <Link href='/manage/news/new' className='flex items-center w-32 text-gray-700 hover:text-blue-600 cursor-pointer'>
                    <div>{t('news.create')}</div>
                </Link> : newsHeaderSkeleton}
                {status !== 'loading' ? < DownloadTable tables={news} selectedTable={selectedNews} /> : newsHeaderSkeleton}
            </ul>
        </nav>
    )
}

export default NewsHeader;
