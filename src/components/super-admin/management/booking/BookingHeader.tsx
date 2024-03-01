import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import DownloadTable from '../DownloadTable'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const BookingHeader = () => {

    const t = useTranslations()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const { bookings, selectedBookings } = useAdminBookingStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-blacr text-xl uppercase'>{t('booking.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {isAdminAllowed('view_reminders') &&
                    <Link href={'/admin/manage/booking/reminders'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.reminders.h1')}</div>
                    </Link>}
                {isAdminAllowed('view_booking_request') &&
                    <Link href={'/admin/manage/booking/request'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.request.h1')}</div>
                    </Link>}
                {isAdminAllowed('view_booking_comments_template') &&
                    <Link href={'/admin/manage/booking/template'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.comments.template.h1')}</div>
                    </Link>}
                {/* {isAdminAllowed('view_booking_comments') &&
                    <Link href={'/admin/manage/booking/comments'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.comments.s')}</div>
                    </Link>} */}
                {isAdminAllowed('create_booking') &&
                    <Link href={'/admin/manage/booking/new'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                        <div>{t('booking.create')}</div>
                    </Link>}
                <DownloadTable tables={bookings} selectedTable={selectedBookings} />
            </ul>
        </nav>
    )
}

export default BookingHeader