/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendarDays, faChartLine, faBuilding, faDisplay, faGear, faHouse, faNewspaper, faUser, faUserSecret, faUserShield, faUsers, faBook, faGlobe, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from '@/lib/navigation';
import useGlobalStore from '@/lib/state/globalStore';
import Logout from '../super-admin/Logout';
import { ADMIN } from '@/utils/constants';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import AdminDepartment from './AdminDepartment';
const AdminSideNav: React.FC = () => {

    const router = useRouter()

    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const { toggleSideNav, isSideNavOpen, locales } = useGlobalStore()
    const { admin, setAdmin, permissions } = useAdminPageStore()

    const pathname = usePathname()

    const handleTranslation = (event: React.ChangeEvent<HTMLSelectElement>) => {
        router.replace(pathname, { locale: event.target.value })
    }

    const locale = useLocale()

    useEffect(() => {

        if (status === 'authenticated' && session.user.type !== ADMIN) signOut()
        if (status === 'authenticated' && session.user.type === ADMIN && !admin) {
            setAdmin(session.user)
            router.push('/admin')
        }

    }, [status])

    const t = useTranslations('super-admin')

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

                    <AdminDepartment />

                    {/* client */}
                    {permissions?.view_client && <Link href={'/admin/manage/client'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.client')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faUser} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.client')} />
                    </Link>}
                    {/* supplier */}
                    {permissions?.view_supplier && <Link href={'/admin/manage/supplier'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.supplier')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faUsers} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.supplier')} />
                    </Link>}
                    {/* schedule */}
                    {permissions?.view_supplier_schedule && <Link href={'/admin/manage/schedule'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.schedule')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faCalendarDays} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.schedule')} />
                    </Link>}
                    {/* agent */}
                    {permissions?.view_agent && <Link href={'/admin/manage/agent'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.agent')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faUserSecret} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.agent')} />
                    </Link>}
                    {/* booking */}
                    {permissions?.view_booking && <Link href={'/admin/manage/booking'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.booking')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faBook} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.booking')} />
                    </Link>}
                    {/* news */}
                    {permissions?.view_news && <Link href={'/admin/manage/news'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.news')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faDisplay} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.news')} />
                    </Link>}
                    {/* orders */}
                    {permissions?.view_orders && <Link href={'/admin/manage/orders'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.orders')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faNewspaper} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.orders')} />
                    </Link>}
                    {/* settings */}
                    {permissions?.handle_settings && <Link href={'/admin/manage/settings'} className={`flex text-base border-b hover:border-blue-600 pb-2 items-center outline-none hover:text-blue-600 w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.settings')}</span>}
                        <FontAwesomeIcon width={20} height={20} icon={faGear} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[20px] h-[20px]'}`} title={t('side-nav.settings')} />
                    </Link>}

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
            {status !== 'authenticated' && <div className='h-screen w-screen grid fixed top-0 left-0 place-content-center bg-black bg-opacity-30 z-50'>
                <FontAwesomeIcon icon={faSpinner} width={30} height={30} className='animate-spin w-[30px] h-[30px]' />
            </div>}
        </>
    );
};

export default AdminSideNav;
