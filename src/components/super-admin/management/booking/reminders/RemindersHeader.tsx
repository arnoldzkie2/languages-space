import Link from 'next-intl/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'

const RemindersHeader = () => {

    const session = useSession()

    const t = useTranslations('super-admin')

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.reminders.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {session.status !== 'loading' ?
                    <Link href={'/manage/booking'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('booking.h1')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ?
                    <Link href={'/manage/schedule'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('schedule.h1')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ?
                    <Link href={'/manage/booking/reminders/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('booking.reminders.create')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ?
                    <Link href={'/manage/booking/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('booking.create')}</div>
                    </Link> : clientHeaderSkeleton}
            </ul>
        </nav>
    )
}

export default RemindersHeader