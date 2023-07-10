import { RootState } from '@/lib/redux/Store';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Client: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    const t = useTranslations('side-nav')

    return (
        <Link href={'/manage/client'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isSideNavOpen && <span className='mr-auto'>{t('client')}</span>}
            <FontAwesomeIcon icon={faUser} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Client;
