/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react'
import { useTranslations } from 'next-intl';
import useClientStore from '@/lib/state/client/clientStore';
import { Link } from '@/lib/navigation';

interface Props {

}

const ClientProfile: React.FC<Props> = () => {

  const navLinks = [
    {
      page: 'profile',
      link: '/client/profile',
      translate: 'profile.profile'
    },
    {
      page: 'cards',
      link: '/client/profile/cards',
      translate: 'profile.cards'
    },
    {
      page: 'bookings',
      link: '/client/profile/bookings',
      translate: 'profile.bookings'
    },
    {
      page: 'booking-request',
      link: '/client/profile/booking-requests',
      translate: 'booking.request.h1'
    },
    {
      page: 'orders',
      link: '/client/profile/orders',
      translate: 'profile.orders'
    },
  ]

  const page = useClientStore(state => state.page)

  const t = useTranslations()

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
        <Link href={'/client/profile/account'}
          className={`${page === 'account' ? 'text-primary' : 'hover:text-primary'}`}
        >{t('profile.account')}</Link>
        <Link href={'/client/profile/support'}
          className={`${page === 'support' ? 'text-primary' : 'hover:text-primary'}`}
        >{t('profile.support')}</Link>
      </ul>
    </div>
  )
}

export default ClientProfile