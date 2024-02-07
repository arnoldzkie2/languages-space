/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import useSupplierStore from '@/lib/state/supplier/supplierStore';

const SupplierProfile = () => {

    const navLinks = [
        {
            page: 'profile',
            link: '/supplier/profile',
            translate: 'profile.profile'
        },
        {
            page: 'balance',
            link: '/supplier/profile/balance',
            translate: 'profile.balance'
        },
        {
            page: 'bookings',
            link: '/supplier/profile/bookings',
            translate: 'profile.my-bookings'
        },
        {
            page: 'booking-request',
            link: '/supplier/profile/booking-requests',
            translate: 'profile.booking-requests'
        },
        {
            page: 'meeting',
            link: '/supplier/profile/meeting',
            translate: 'profile.my-meeting'
        }
    ]

    const page = useSupplierStore(state => state.page)
    const setPage = useSupplierStore(state => state.setPage)

    const t = useTranslations('client')

    return (
        <div className='flex flex-col gap-3 w-full lg:w-1/4 order-2 md:order-1 text-muted-foreground'>
            <ul className='flex flex-col gap-3'>
                <li className='text-foreground text-lg font-bold'>{t('profile.navigate')}</li>
                {navLinks.map(link => (
                    <Link href={link.link} key={link.link}
                        className={`${page === link.page ? 'text-primary' : 'hover:text-primary'}`}
                    >{t(link.translate)}</Link>
                ))}
                <li className='text-foreground text-lg font-bold'>{t('profile.settings')}</li>
                <Link href={'/supplier/profile/account'}
                    className={`${page === 'account' ? 'text-primary' : ' hover:text-primary'}`}
                    onClick={() => setPage('account')}>{t('profile.account')}</Link>
            </ul>
        </div>
    )
}

export default SupplierProfile