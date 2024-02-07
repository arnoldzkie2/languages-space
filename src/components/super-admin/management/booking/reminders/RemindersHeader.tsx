import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const RemindersHeader = () => {

    const t = useTranslations('super-admin')

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('booking.reminders.h1')}</h1>
            <ul className='flex items-center text-muted-foreground h-full ml-auto gap-5'>
                {isAdminAllowed('view_booking') &&
                    <Link href={'/admin/manage/booking'} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.h1')}</div>
                    </Link>}
                {isAdminAllowed('create_reminders') &&
                    <Link href={'/admin/manage/booking/reminders/new'} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.reminders.create')}</div>
                    </Link>}
                {isAdminAllowed('view_booking_request') &&
                    <Link href={'/admin/manage/booking/request'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.request.h2')}</div>
                    </Link>}
            </ul>
        </nav>
    )
}

export default RemindersHeader