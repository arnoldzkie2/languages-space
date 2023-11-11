'use client'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';

const Logout: React.FC = () => {

    const t = useTranslations('super-admin')

    const { isSideNavOpen } = useAdminGlobalStore()
    return (
        <li className='flex items-center justify-between text-black hover:text-blue-600 cursor-pointer mt-auto'
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>
            {isSideNavOpen && <span>{t('side-nav.logout')}</span>}
            <FontAwesomeIcon width={20} height={20}  icon={faArrowRightToBracket} className={`flex justify-center ${!isSideNavOpen && 'w-full text-xl'}`} />
        </li>
    );
}

export default Logout;
