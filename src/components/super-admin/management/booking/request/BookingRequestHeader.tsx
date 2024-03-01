import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import DownloadTable from '../../DownloadTable'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const BookingRequestHeader = () => {

    const t = useTranslations()

    const isADminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const { bookingRequests, selectedBookingRequests } = useAdminBookingStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('booking.request.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-10 text-muted-foreground'>
                {isADminAllowed('view_reminders') &&
                    <Link href={'/admin/manage/booking/reminders'} className='flex items-center hover:text-primary justify-center cursor-pointer gap-1'>
                        <div>{t('booking.reminders.h1')}</div>
                    </Link>}
                {isADminAllowed('create_booking_request') &&
                    <Link href={'/admin/manage/booking/request/new'} className='flex items-center hover:text-primary justify-center w-48 cursor-pointer gap-1'>
                        <div>{t('booking.request.create')}</div>
                    </Link>}
                {isADminAllowed('view_booking') &&
                    <Link href={'/admin/manage/booking'} className='flex items-center hover:text-primary justify-center cursor-pointer gap-1'>
                        <div>{t('booking.manage')}</div>
                    </Link>}
                <DownloadTable tables={bookingRequests} selectedTable={selectedBookingRequests} />
            </ul>
        </nav>
    )
}

export default BookingRequestHeader