/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import { Booking } from '@/lib/types/super-admin/bookingType'
import TruncateTextModal from '../global/TruncateTextModal'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import RequestCancelBookingModal from '../client/RequestCancelBookingModal'
import Success from '../global/Success'
import Err from '../global/Err'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { CONFIRMED } from '@/utils/constants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

const SupplierBooking: React.FC = () => {

    const [currentBookings, setCurrentBookings] = useState<Booking[] | null>(null)

    const supplier = useSupplierStore(s => s.supplier)
    const { getBookings, bookings, requestCancelBooking } = useSupplierBookingStore()
    const { skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const setPage = useSupplierStore(state => state.setPage)
    const { getCurrentData, currentPage } = useGlobalPaginationStore()

    useEffect(() => {
        setPage('bookings')
        if (!bookings && supplier?.id) getBookings()
    }, [supplier?.id])

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookings))
    }, [currentPage, bookings])

    return (
        <div className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='w-full border-b pb-1 mb-1 flex items-center gap-5'>
                <h1 className='text-foreground text-lg font-bold'>{t('profile.my-bookings')}</h1>
                <Success />
                <Err />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="p-3">{tt('schedule')}</th>
                            <th scope="col" className="p-3">{tt('client')}</th>
                            <th scope="col" className="p-3">{tt('card')}</th>
                            <th scope="col" className="p-3">{tt('status')}</th>
                            <th scope="col" className="p-3">{tt('note')}</th>
                            <th scope="col" className="p-3">{tt('date')}</th>
                            <th scope="col" className="p-3">{ttt('global.operation')}</th>
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
                                        {tt('no-data')}
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

const Operations = ({ booking }: { booking: Booking }) => {

    const [open, setOpen] = useState(false)

    const tt = useTranslations("super-admin")
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <FontAwesomeIcon icon={faEllipsis} width={18} height={18} className='cursor-pointer text-lg' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{tt("global.operation")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <ReturnCancelButton booking={booking} /> */}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const ReturnCancelButton = ({ booking }: { booking: Booking }) => {

    const openRequestCancelBookingaModal = useClientBookingStore(s => s.openRequestCancelBookingaModal)
    const scheduleDate = booking.schedule.date;
    const scheduleTime = booking.schedule.time;
    const today = new Date();
    const bookingDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const threeHoursAhead = new Date(today.getTime() + 3 * 60 * 60 * 1000);

    const tt = useTranslations('global');

    if (booking.status === 'canceled' || booking.status === 'cancel-request') return null

    if (bookingDateTime >= threeHoursAhead && booking.status === CONFIRMED) return (
        <Button
            onClick={() => openRequestCancelBookingaModal(booking.id)}
            variant={'destructive'}
        >
            {tt('cancel')}
        </Button>
    );

    return null

};

export default SupplierBooking