'use client'
import useGlobalStore from '@/lib/state/globalStore';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';

const Logout: React.FC = () => {

    const t = useTranslations()

    const isSideNavOpen = useGlobalStore(s => s.isSideNavOpen)

    return (
        <li className={`flex items-center justify-between w-full gap-5 text-muted-foreground hover:text-primary cursor-pointer text-sm`}
            onClick={() => signOut({ redirect: true, callbackUrl: '/auth' })}>
            {isSideNavOpen && <span>{t('auth.logout')}</span>}
            <FontAwesomeIcon width={20} height={20} icon={faArrowRightToBracket} className={`flex justify-center ${!isSideNavOpen && 'w-full text-xl'}`} />
        </li>
    );
}

export default Logout;
