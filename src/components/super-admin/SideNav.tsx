'use client'
import React, { useState } from 'react';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendarDays, faChartLine, faDisplay, faGear, faHouse, faNewspaper, faUser, faUserSecret, faUserShield, faUsers } from '@fortawesome/free-solid-svg-icons';
import Link from 'next-intl/link';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';

const SideNav: React.FC = () => {

    const { toggleSideNav, isSideNavOpen } = useAdminGlobalStore()

    const t = useTranslations('super-admin')

    const [navArray, setNavArray] = useState([
        {
            translate: 'side-nav.dashboard',
            icon: faHouse,
            link: '/super-admin'
        },
        {
            translate: 'side-nav.client',
            icon: faUser,
            link: '/manage/client'
        },
        {
            translate: 'side-nav.supplier',
            icon: faUsers,
            link: '/manage/supplier'
        },
        {
            translate: 'side-nav.schedule',
            icon: faCalendarDays,
            link: '/manage/schedule'
        },
        {
            translate: 'side-nav.news',
            icon: faDisplay,
            link: '/manage/news'
        },
        {
            translate: 'side-nav.agent',
            icon: faUserSecret,
            link: '/manage/agent'
        },
        {
            translate: 'side-nav.admin',
            icon: faUserShield,
            link: '/manage/admin'
        },
        {
            translate: 'side-nav.statistics',
            icon: faChartLine,
            link: '/manage/statistics'
        },
        {
            translate: 'side-nav.orders',
            icon: faNewspaper,
            link: '/manage/orders'
        },
        {
            translate: 'side-nav.settings',
            icon: faGear,
            link: '/super-admin/settings'
        },

    ])

    return (
        <nav className={`border-r ${isSideNavOpen ? 'w-44 p-6' : 'w-16 px-3 py-6'} fixed h-screen flex flex-col bg-white`}>
            {
                isSideNavOpen ?
                    <button
                        onClick={() => toggleSideNav()}
                        className='text-lg flex justify-between items-center pb-4 border-b border-gray-600 hover:text-blue-600'>
                        Menu <FontAwesomeIcon icon={faArrowLeft} width={20} height={20} />
                    </button>
                    :
                    <FontAwesomeIcon icon={faArrowRight} width={20} height={20}
                        className='pb-4 border-b text-xl text-black w-full border-gray-600 cursor-pointer hover:text-blue-600'
                        onClick={() => toggleSideNav()} />
            }
            <ul className='flex flex-col gap-7 h-full py-7 justify-center'>
                {navArray.map(nav => (
                    <Link href={nav.link} className={`flex items-center hover:text-blue-600 w-full`} key={nav.link}>
                        {isSideNavOpen && <span className='mr-auto'>{t(nav.translate)}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={nav.icon} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
                    </Link >
                ))}
            </ul>
            <Logout />
        </nav>
    );
};

export default SideNav;
