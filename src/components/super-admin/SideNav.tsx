'use client'
import React, { useState } from 'react';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendarDays, faChartLine, faBuilding, faDisplay, faGear, faHouse, faNewspaper, faUser, faUserSecret, faUserShield, faUsers, faBook, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Link from 'next-intl/link';
import { useLocale, useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { usePathname } from 'next-intl/client';
import { useRouter } from 'next/navigation';

const SideNav: React.FC = () => {

    const { toggleSideNav, isSideNavOpen, locales } = useAdminGlobalStore()

    const t = useTranslations('super-admin')

    const [navArray, setNavArray] = useState([
        {
            translate: 'side-nav.dashboard',
            icon: faHouse,
            link: '/super-admin'
        },
        {
            translate: 'side-nav.booking',
            icon: faBook,
            link: '/manage/booking'
        },
        {
            translate: 'side-nav.department',
            icon: faBuilding,
            link: '/manage/department'
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

    const router = useRouter()

    const currentPathname = usePathname()

    const handleTranslation = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLocale = event.target.value;
        const newPath = `/${selectedLocale}${currentPathname}`
        router.push(newPath)
    }
    const locale = useLocale()

    return (
        <nav className={`border-r ${isSideNavOpen ? 'w-44 p-6' : 'w-16 px-3 py-6'} fixed h-screen flex flex-col bg-white`}>
            {
                isSideNavOpen ?
                    <button
                        onClick={() => toggleSideNav()}
                        className='text-lg flex justify-between items-center pb-4 border-b border-gray-600 hover:text-blue-600'>
                        {t('side-nav.menu')} <FontAwesomeIcon icon={faArrowLeft} width={20} height={20} className='w-[20px] h-[20px]' />
                    </button>
                    :
                    <FontAwesomeIcon icon={faArrowRight} width={20} height={20}
                        className='pb-4 border-b text-xl text-black mr-auto ml-auto border-gray-600 w-[20px] h-[20px] cursor-pointer hover:text-blue-600'
                        onClick={() => toggleSideNav()} />
            }
            <ul className='flex flex-col items-center gap-4 h-full py-7 justify-center'>
                {navArray.map(nav => (
                    <Link href={nav.link} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`} key={nav.link}>
                        {isSideNavOpen && <span className='mr-auto'>{t(nav.translate)}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={nav.icon} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} />
                    </Link >
                ))}
                <div className='w-full relative'>
                    <FontAwesomeIcon icon={faGlobe} width={20} height={20} className={`absolute top-2 ${isSideNavOpen ? 'right-0 -z-10' : 'right-3 z-10 cursor-pointer hover:text-blue-600'}`} onClick={toggleSideNav} />
                    <select id='locale' className={`py-2 w-full px-1 ${isSideNavOpen ? 'block' : 'hidden'} text-sm bg-transparent border-0 cursor-pointer border-b appearance-none focus:outline-none focus:ring-0 hover:border-blue-500 outline-none`} value={locale} onChange={handleTranslation}>
                        {locales.map(loc => (
                            <option value={loc.loc} key={loc.loc} className='flex items-center justify-between'>
                                {loc.val}
                            </option>
                        ))}
                    </select>
                </div>
            </ul>

            <Logout />
        </nav>
    );
};

export default SideNav;
