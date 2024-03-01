'use client'
import Link from 'next/link';
import React from 'react';
import DownloadTable from '../DownloadTable';
import { useTranslations } from 'next-intl';
import useAdminNewsStore from '@/lib/state/super-admin/newsStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const NewsHeader: React.FC = ({ }) => {

    const { news, selectedNews } = useAdminNewsStore()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const t = useTranslations()

    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-bold text-xl uppercase'>{t('news.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {isAdminAllowed('create_news') && <Link href='/admin/manage/news/new' className='flex items-center w-32 text-muted-foreground hover:text-primary cursor-pointer'>
                    <div>{t('news.create')}</div>
                </Link>}
                < DownloadTable tables={news} selectedTable={selectedNews} />
            </ul>
        </nav>
    )
}

export default NewsHeader;
