/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';

const AgentProfile = () => {

    const navLinks = [
        {
            page: 'profile',
            link: '/agent/profile',
            translate: 'profile.profile'
        },
        {
            page: 'balance',
            link: '/agent/profile/balance',
            translate: 'balance.my_balance'
        },
        {
            page: 'invites',
            link: '/agent/profile/invites',
            translate: 'profile.invites'
        },
    ]

    const page = useGlobalStore(s => s.page)
    const setPage = useGlobalStore(s => s.setPage)

    const t = useTranslations()

    return (
        <div className='flex flex-col gap-3 w-full lg:w-1/4 order-2 md:order-1 text-muted-foreground'>
            <ul className='flex flex-col gap-3'>
                <li className='text-foreground text-lg font-bold'>{t('profile.navigate')}</li>
                {navLinks.map(link => (
                    <Link href={link.link} key={link.link}
                        className={`${page === link.page ? ' text-primary' : 'hover:text-primary'}`}
                    >{t(link.translate)}</Link>
                ))}
                <li className='text-foreground text-lg font-bold'>{t('profile.settings')}</li>
                <Link href={'/agent/profile/account'}
                    className={`${page === 'account' ? ' text-primary' : 'hover:text-primary'}`}
                    onClick={() => setPage('account')}>{t('profile.account')}</Link>
            </ul>
        </div>
    )
}

export default AgentProfile