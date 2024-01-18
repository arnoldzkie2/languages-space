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

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookingRequests))
    }, [currentPage, bookingRequests])

    return (
        <div className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='w-full border-b pb-1 mb-1 flex items-center gap-5'>
                <h1 className='text-blue-600 text-lg font-bold'>{t('profile.booking-requests')}</h1>
                <Success />
                <Err />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-gray-800 shadow-md w-full">
                    <thead className="text-xs uppercase bg-slate-100 border">
                        <tr>
                            <th scope="col" className="p-3">{tt('schedule')}</th>
                            <th scope="col" className="p-3">{tt('client')}</th>
                            <th scope="col" className="p-3">{tt('status')}</th>
                            <th scope="col" className="p-3">{tt('note')}</th>
                            <th scope="col" className="p-3">{tt('date')}</th>
                            <th scope="col" className="p-3">{ttt('global.operation')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings && currentBookings.length > 0 ?
                            currentBookings.map(bookingRequest => (
                                <tr className="bg-white border hover:bg-slate-50" key={bookingRequest.id}>
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
                                                    onClick={(e) => cancelBookingRequest(e, bookingRequest.id)}>{tt('cancel')}</Button>
                                                <Button
                                                    onClick={(e) => confirmBookingRequest(e, bookingRequest.id)}>{tt("confirm")}</Button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            )) :
                            currentBookings && currentBookings.length < 1 ?
                                <tr>
                                    <td className='w-full px-3 py-2'>
                                        {tt('no-data')}
                                    </td>
                                </tr> :
                                skeleton.map(item => (
                                    <tr key={item}>
                                        <td className='p-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                                        </td>
                                        <td className='p-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                                        </td>
                                        <td className='p-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                                        </td>
                                        <td className='p-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                                        </td>
                                        <td className='p-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
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