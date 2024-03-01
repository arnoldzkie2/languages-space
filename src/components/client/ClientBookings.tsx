/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import useClientStore from '@/lib/state/client/clientStore'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from './TablePagination'
import Err from '../global/Err'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import useGlobalStore from '@/lib/state/globalStore'
import SubmitButton from '../global/SubmitButton'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import CreateClientCommentAlert from './CreateClientCommentAlert'
import { CANCELED, COMPLETED } from '@/utils/constants'
import UpdateClientCommentAlert from './UpdateClientCommentsAlert'
import ViewSupplierCommentAlert from '../supplier/ViewSupplierBookingComment'

const ClientBookings: React.FC = () => {

    const [currentBookings, setCurrentBookings] = useState<BookingProps[] | null>(null)

    const { bookings, getBookings } = useClientBookingStore()
    const { client, setPage } = useClientStore()
    const { getCurrentData, currentPage } = useGlobalPaginationStore()
    const { returnTruncateText, openTruncateTextModal } = useGlobalStore()
    useEffect(() => {
        setPage('bookings')
        if (!bookings && client?.id) getBookings()
    }, [client])

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookings))
    }, [currentPage, bookings])

    const t = useTranslations()

    return (
        <ul className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='flex w-full pb-1 mb-1 border-b items-center gap-5'>
                <h1 className='text-foreground text-lg font-bold'>{t('profile.bookings')}</h1>
                <Err />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{t('side_nav.schedule')}</th>
                            <th scope="col" className="px-3 py-3">{t('user.supplier')}</th>
                            <th scope="col" className="px-3 py-3">{t('side_nav.card')}</th>
                            <th scope="col" className="px-3 py-3">{t('status.h1')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.note')}</th>
                            <th scope="col" className="px-3 py-3">{t('info.date.h1')}</th>
                            <th scope="col" className="px-3 py-3">{t('operation.h1')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings && currentBookings.length > 0 ?
                            currentBookings.map(booking => (
                                <tr className="bg-card border hover:bg-muted overflow-x-auto" key={booking.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {booking.schedule.date} ({booking.schedule.time})
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-32'>
                                            {returnTruncateText(booking.supplier.name, 10)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {returnTruncateText(booking.card_name, 10)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {returnTruncateText(booking.status, 10)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {booking.note &&
                                            <div className={`h-5 text-xs md:text-sm w-36 cursor-pointer`} onClick={() => openTruncateTextModal(booking.note || 'No Data')}>
                                                {returnTruncateText(booking.note || '', 15)}
                                            </div>
                                        }
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(booking.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <ReturnCancelButton booking={booking} />
                                    </td>
                                </tr>
                            )) : currentBookings && currentBookings.length < 1 ?
                                <tr className='border bg-card'>
                                    <td className='p-3'>
                                        {t('global.no_data')}
                                    </td>
                                </tr>
                                :
                                <SkeletonTable />
                        }
                    </tbody >
                </table >
            </div>
            <TablePagination data={bookings || []} />
        </ul>
    )
}

const ReturnCancelButton = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)

    const { openRequestCancelBookingaModal, cancelBooking } = useClientBookingStore()
    const scheduleDate = booking.schedule.date;
    const scheduleTime = booking.schedule.time;
    const today = new Date();
    const bookingDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const threeHoursAhead = new Date(today.getTime() + 3 * 60 * 60 * 1000);

    const t = useTranslations();

    const cancelBookingElement = (
        <form onSubmit={(e) => cancelBooking(e, booking.id)} className='w-full'>
            <SubmitButton style='w-full' msg={t('operation.cancel')} variant={'destructive'} />
        </form >
    )

    const requestCancelBookingElement = (
        <Button
            variant={'destructive'}
            onClick={() => openRequestCancelBookingaModal(booking.id)}
            className='w-full'
            title='Send request admin to cancel this booking'>{t("operation.cancel")}</Button>
    )

    if (booking.status === CANCELED) return null

    const cancelButton = bookingDateTime >= threeHoursAhead ? cancelBookingElement : requestCancelBookingElement

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <FontAwesomeIcon className='hover:text-foreground text-lg' icon={faEllipsis} width={18} height={18} />
            </PopoverTrigger>
            <PopoverContent>
                <div className='flex items-center flex-col gap-5 w-full'>
                    {cancelButton}
                    {booking.status === COMPLETED && <h1 className='border-b w-full pb-2'>{t("booking.comments.h1")}</h1>}
                    {booking.status === COMPLETED && <div className='flex items-center gap-3 w-full'>
                        {booking.client_comment ? <UpdateClientCommentAlert booking={booking} /> : <CreateClientCommentAlert booking={booking} />}
                        <ViewSupplierCommentAlert booking={booking} />
                    </div>}
                </div>
            </PopoverContent>
        </Popover>
    )
}

const SkeletonTable = () => {

    const skeleton = useGlobalStore(s => s.skeleton)

    return (
        <>
            {skeleton.map(item => (
                <tr key={item} className='bg-card border'>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-3'>
                        <Skeleton className='rounded-3xl w-20 h-5'></Skeleton>
                    </td>
                </tr>
            ))}
        </>
    )
}


export default ClientBookings