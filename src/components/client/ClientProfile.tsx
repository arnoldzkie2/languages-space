/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useClientStore from '@/lib/state/client/clientStore';

interface Props {

}

const ClientProfile: React.FC<Props> = () => {

  const session = useSession()

  const navLinks = [
    {
      page: 'profile',
      link: '/client/profile',
      translate: 'profile.profile'
    },
    {
      page: 'cards',
      link: '/client/profile/cards',
      translate: 'profile.my-cards'
    },
    {
      page: 'bookings',
      link: '/client/profile/bookings',
      translate: 'profile.my-bookings'
    },
    {
      page: 'booking-request',
      link: '/client/profile/booking-requests',
      translate: 'profile.booking-requests'
    },
    {
      page: 'orders',
      link: '/client/profile/orders',
      translate: 'profile.my-orders'
    },
  ]

  const page = useClientStore(state => state.page)
  const setPage = useClientStore(state => state.setPage)

  const t = useTranslations('client')

  return (
    <div className='flex flex-col gap-3 w-full lg:w-1/4 order-2 md:order-1'>
      <div className='items-center gap-4 w-full hidden md:flex flex-row'>
        {session.status === 'authenticated' && session.status === 'authenticated' ? <Image width={50} height={50}
          src={session.data.user.profile_url || '/profile/profile.svg'}
          alt='profile' className='border rounded-full md:w-[50px] md:h-[50px] object-cover' /> : <div className='rounded-full bg-slate-200 animate-pulse md:h-[50px] md:w-[50px]'></div>}
        {session.status === 'authenticated' ? <h1 className='text-2xl md:text-xl border-b pb-1 mb-1'>{session.data.user.username || ''}</h1>
          : <h1 className='w-44 h-7 bg-slate-200 rounded-3xl animate-pulse'></h1>}
      </div>
      <ul className='flex flex-col gap-3'>
        <li className='text-blue-600 border-b pb-1 mb-1 text-lg font-bold'>{t('profile.navigate')}</li>
        {navLinks.map(link => (
          <Link href={link.link} key={link.link}
            className={`${page === link.page ? 'border-b text-blue-600' : 'hover:text-blue-600 hover:border-b'} mb-1 pb-1`}
          >{t(link.translate)}</Link>
        ))}
        <li className='text-blue-600 border-b pb-1 mb-1 text-lg font-bold'>{t('profile.settings')}</li>
        <Link href={'/client/profile/account'}
          className={`${page === 'account' ? 'border-b text-blue-600' : 'hover:border-b hover:text-blue-600'} mb-1 pb-1`}
          onClick={() => setPage('account')}>{t('profile.account')}</Link>
      </ul>
    </div>
  )
}

export default ClientProfile