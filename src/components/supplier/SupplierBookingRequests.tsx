/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from '../client/TablePagination'
import useGlobalStore from '@/lib/state/globalStore'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import { BookingRequest } from '@/lib/types/super-admin/bookingType'
import TruncateTextModal from '../global/TruncateTextModal'
import Success from '../global/Success'
import Err from '../global/Err'
import { Button } from '../ui/button'
import { CANCELED, CONFIRMED } from '@/utils/constants'
import { Skeleton } from '../ui/skeleton'

const SupplierBookingRequest: React.FC = () => {

    const [currentBookings, setCurrentBookings] = useState<BookingRequest[] | null>(null)

    const supplier = useSupplierStore(s => s.supplier)
    const { getBookingRequests, bookingRequests, cancelBookingRequest, confirmBookingRequest } = useSupplierBookingStore()
    const { skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const setPage = useSupplierStore(state => state.setPage)
    const { getCurrentData, currentPage } = useGlobalPaginationStore()

    useEffect(() => {
        setPage('booking-request')
        if (!bookingRequests && supplier?.id) getBookingRequests()
    }, [supplier?.id])

    const t = useTranslations()

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookingRequests))
    }, [currentPage, bookingRequests])

    return (
        <div className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='w-full border-b pb-1 mb-1 flex items-center gap-5'>
                <h1 className='text-foreground text-lg font-bold'>{t('booking.request.h1')}</h1>
                <Success />
                <Err />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                    <thead className="text-xs uppercase bg-card border">
                        <tr>
                            <th scope="col" className="p-3">{t('side_nav.schedule')}</th>
                            <th scope="col" className="p-3">{t('user.client')}</th>
                            <th scope="col" className="p-3">{t('status.h1')}</th>
                            <th scope="col" className="p-3">{t('info.note')}</th>
                            <th scope="col" className="p-3">{t('info.date.h1')}</th>
                            <th scope="col" className="p-3">{t('operation.h1')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings && currentBookings.length > 0 ?
                            currentBookings.map(bookingRequest => (
                                <tr className="bg-card border hover:bg-muted" key={bookingRequest.id}>
                                    <td className='p-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {bookingRequest.date} ({bookingRequest.time})
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs md:text-sm w-32'>
                                            {bookingRequest.client.name}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {bookingRequest.status}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        {bookingRequest.note &&
                                            <div className={`h-5 text-xs md:text-sm w-36 cursor-pointer`} onClick={() => openTruncateTextModal(bookingRequest.note || 'No Data')}>
                                                {returnTruncateText(bookingRequest.note || '', 15)}
                                            </div>
                                        }
                                    </td>
                                    <td className="p-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(bookingRequest.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className='p-3'>
                                        {bookingRequest.status !== CANCELED && bookingRequest.status !== CONFIRMED &&
                                            <div className='w-full flex items-center gap-2'>
                                                <Button
                                                    variant={'secondary'}
                                                    className='border text-muted-foreground'
                                                    onClick={(e) => cancelBookingRequest(e, bookingRequest.id)}>{t('operation.cancel')}</Button>
                                                <Button
                                                    onClick={(e) => confirmBookingRequest(e, bookingRequest.id)}>{t("operation.confirm")}</Button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            )) :
                            currentBookings && currentBookings.length < 1 ?
                                <tr className='bg-card border'>
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
            <TablePagination data={bookingRequests || []} />
        </div>
    )
}


export default SupplierBookingRequest