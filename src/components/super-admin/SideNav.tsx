'use client'
import React, { useEffect, useState } from 'react';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendarDays, faChartLine, faBuilding, faDisplay, faGear, faHouse, faNewspaper, faUser, faUserSecret, faUserShield, faUsers, faBook, faGlobe, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from '@/lib/navigation';
import useGlobalStore from '@/lib/state/globalStore';
const SideNav: React.FC = () => {

    const router = useRouter()

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const { toggleSideNav, isSideNavOpen, locales } = useGlobalStore()

    const t = useTranslations('super-admin')

    const [navArray, setNavArray] = useState(
        [
            {
                id: 1,
                translate: 'side-nav.dashboard',
                icon: faHouse,
                link: '/super-admin'
            },
            {
                id: 2,
                translate: 'side-nav.booking',
                icon: faBook,
                link: '/manage/booking'
            },
            {
                id: 3,
                translate: 'side-nav.department',
                icon: faBuilding,
                link: '/manage/department'
            },
            {
                id: 4,
                translate: 'side-nav.client',
                icon: faUser,
                link: '/manage/client'
            },
            {
                id: 5,
                translate: 'side-nav.supplier',
                icon: faUsers,
                link: '/manage/supplier'
            },
            {
                id: 6,
                translate: 'side-nav.schedule',
                icon: faCalendarDays,
                link: '/manage/schedule'
            },
            {
                id: 7,
                translate: 'side-nav.news',
                icon: faDisplay,
                link: '/manage/news'
            },
            {
                id: 8,
                translate: 'side-nav.agent',
                icon: faUserSecret,
                link: '/manage/agent'
            },
            {
                id: 9,
                translate: 'side-nav.admin',
                icon: faUserShield,
                link: '/manage/admin'
            },
            {
                id: 10,
                translate: 'side-nav.statistics',
                icon: faChartLine,
                link: '/manage/statistics'
            },
            {
                id: 11,
                translate: 'side-nav.orders',
                icon: faNewspaper,
                link: '/manage/orders'
            },
            {
                id: 12,
                translate: 'side-nav.settings',
                icon: faGear,
                link: '/super-admin/settings'
            },

        ])

    const pathname = usePathname()

    const handleTranslation = (event: React.ChangeEvent<HTMLSelectElement>) => {
        router.replace(pathname, { locale: event.target.value })
    }

    const locale = useLocale()

    useEffect(() => {

        if (session.status === 'authenticated' && session.data?.user.type !== 'super-admin') {
            signOut()
        }

    }, [session])

    return (
        <>
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
                            className='text-lg flex w-full cursor-pointer justify-center items-center border-gray-600 hover:text-blue-600'
                            onClick={() => toggleSideNav()} />
                }
                <ul className='flex flex-col items-center gap-4 h-full py-7 justify-center'>
                    {navArray.length > 0 ? navArray.map(nav => (
                        <Link href={nav.link} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`} key={nav.id}>
                            {isSideNavOpen && <span className='mr-auto'>{t(nav.translate)}</span>}
                            <FontAwesomeIcon width={20} height={20} icon={nav.icon} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t(nav.translate)} />
                        </Link>
                    )) : null}
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
            {session.status !== 'authenticated' && <div className='h-screen w-screen grid fixed top-0 left-0 place-content-center bg-black bg-opacity-30 z-50'>
                <FontAwesomeIcon icon={faSpinner} width={30} height={30} className='animate-spin w-[30px] h-[30px]' />
            </div>}
        </>
    );
};

export default SideNav;
