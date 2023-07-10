'use client'
import SideNav from '@/components/super-admin/SideNav';
import { useTranslations } from 'next-intl';
import React from 'react';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {

    const t = useTranslations('hello')


    return (
        <div className='flex h-screen'>
            <SideNav  />
            <div className='w-full h-full flex items-center justify-center'>{t('test')}</div>
        </div>
    );
};

export default Page;
