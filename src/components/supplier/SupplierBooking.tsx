/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import TruncateTextModal from '../global/TruncateTextModal'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import RequestCancelBookingModal from '../client/RequestCancelBookingModal'
import Success from '../global/Success'
import Err from '../global/Err'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { COMPLETED, CONFIRMED } from '@/utils/constants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import CreateSupplierCommentAlert from './CreateSupplierBookingComment'
import ViewSupplierCommentAlert from './ViewSupplierBookingComment'
import ViewClientCommentAlert from '../client/ViewClientCommentAlert'
import UpdateSupplierCommentAlert from './UpdateSupplierBookingComment'

const SupplierBooking: React.FC = () => {

    const [currentBookings, setCurrentBookings] = useState<BookingProps[] | null>(null)

    const supplier = useSupplierStore(s => s.supplier)
    const { getBookings, bookings, requestCancelBooking } = useSupplierBookingStore()
    const { skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const setPage = useSupplierStore(state => state.setPage)
    const { getCurrentData, currentPage } = useGlobalPaginationStore()

    useEffect(() => {
        setPage('bookings')
        if (!bookings && supplier?.id) getBookings()
    }, [supplier?.id])

    const t = useTranslations()

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookings))
    }, [currentPage, bookings])

    return (
        <div className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='w-full border-b pb-1 mb-1 flex items-center gap-5'>
                <h1 className='text-foreground text-lg font-bold'>{t('profile.bookings')}</h1>
                <Success />
                <Err />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="p-3">{t('side_nav.schedule')}</th>
                            <th scope="col" className="p-3">{t('user.client')}</th>
                            <th scope="col" className="p-3">{t('side_nav.card')}</th>
                            <th scope="col" className="p-3">{t('status.h1')}</th>
                            <th scope="col" className="p-3">{t('info.note')}</th>
                            <th scope="col" className="p-3">{t('info.date.h1')}</th>
                            <th scope="col" className="p-3">{t('operation.h1')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings && currentBookings.length > 0 ?
                            currentBookings.map(booking => (
                                <tr className="bg-card border hover:bg-muted" key={booking.id}>
                                    <td className='p-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {booking.schedule.date} ({booking.schedule.time})
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs md:text-sm w-32 cursor-pointer' onClick={() => openTruncateTextModal(booking.client.username)}>
                                            {returnTruncateText(booking.client.username, 12)}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs md:text-sm w-24 cursor-pointer' onClick={() => openTruncateTextModal(booking.card_name)}>
                                            {returnTruncateText(booking.card_name, 10)}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {booking.status}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        {booking.note &&
                                            <div className={`h-5 text-xs md:text-sm w-36 cursor-pointer`} onClick={() => openTruncateTextModal(booking.note || 'No Data')}>
                                                {returnTruncateText(booking.note || '', 15)}
                                            </div>
                                        }
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(booking.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className='p-3'>
                                        <Operations booking={booking} />
                                    </td>
                                </tr>
                            )) :
                            currentBookings && currentBookings.length < 1 ?
                                <tr className='border bg-card'>
                                    <td className='w-full px-3 py-2'>
                                        {t('global.no_data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item} className='bg-card border'>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                        </td>
                                        <td className='p-3'>
                                            <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody >
                </table >
            </div>
            <TruncateTextModal />
            <TablePagination data={bookings || []} />
            <RequestCancelBookingModal requestCancelBooking={requestCancelBooking} />
        </div>
    )
}

const Operations = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)

    const t = useTranslations()
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FontAwesomeIcon icon={faEllipsis} width={18} height={18} className='cursor-pointer text-lg hover:text-foreground' />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-5">
                <ReturnCancelButton booking={booking} />
                {booking.status === COMPLETED && <h1 className='border-b pb-2'>{t('booking.comments.h1')}</h1>}
                {booking.status === COMPLETED && <div className='flex items-center gap-5 w-full'>
                    {booking.supplier_comment ? <UpdateSupplierCommentAlert booking={booking} /> : <CreateSupplierCommentAlert booking={booking} />}
                    <ViewClientCommentAlert booking={booking} />
                </div>}
            </PopoverContent>
        </Popover>
    )
}

const ReturnCancelButton = ({ booking }: { booking: BookingProps }) => {

    const openRequestCancelBookingaModal = useClientBookingStore(s => s.openRequestCancelBookingaModal)
    const scheduleDate = booking.schedule.date;
    const scheduleTime = booking.schedule.time;
    const today = new Date();
    const bookingDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const threeHoursAhead = new Date(today.getTime() + 3 * 60 * 60 * 1000);

    const t = useTranslations();

    if (booking.status === 'canceled' || booking.status === 'cancel-request') return null

    if (bookingDateTime >= threeHoursAhead && booking.status === CONFIRMED) return (
        <Button
            className='w-full'
            onClick={() => openRequestCancelBookingaModal(booking.id)}
            variant={'destructive'}
        >
            {t('operation.cancel')}
        </Button>
    );

    return null

};

export default SupplierBooking