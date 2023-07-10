'use client'
import { RootState } from '@/lib/redux/Store';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Statistics: React.FC = () => {

        const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)

        const t = useTranslations('side-nav')
    return (
        <Link href={'/manage/statistics'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isSideNavOpen && <span className='mr-auto'>{t('statistics')}</span>}
            <FontAwesomeIcon icon={faChartLine} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Statistics;
