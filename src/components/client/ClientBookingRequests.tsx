/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import useClientStore from '@/lib/state/client/clientStore'
import { Booking, BookingRequest } from '@/lib/types/super-admin/bookingType'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import TablePagination from './TablePagination'
import Err from '../global/Err'
import Success from '../global/Success'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import useGlobalStore from '@/lib/state/globalStore'
import SubmitButton from '../global/SubmitButton'
import { Button } from '../ui/button'
import { CANCELED, CONFIRMED } from '@/utils/constants'

const ClientBookingRequest: React.FC = () => {

    const [currentBookings, setCurrentBookings] = useState<BookingRequest[] | null>(null)

    const { bookingRequests, getBookingRequests, cancelBookingRequest } = useClientBookingStore()
    const { client, setPage } = useClientStore()
    const { getCurrentData, currentPage } = useGlobalPaginationStore()
    const { returnTruncateText, openTruncateTextModal } = useGlobalStore()
    useEffect(() => {
        setPage('booking-request')
        if (!bookingRequests && client?.id) getBookingRequests()
    }, [client])

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookingRequests))
    }, [currentPage, bookingRequests])

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    return (
        <ul className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <div className='flex w-full pb-1 mb-1 border-b items-center gap-5'>
                <h1 className='text-blue-600 text-lg font-bold'>{t('profile.booking-requests')}</h1>
                <Err />
                <Success />
            </div>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-gray-800 shadow-md w-full">
                    <thead className="text-xs uppercase bg-slate-100 border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{tt('schedule')}</th>
                            <th scope="col" className="px-3 py-3">{tt('supplier')}</th>
                            <th scope="col" className="px-3 py-3">{tt('card')}</th>
                            <th scope="col" className="px-3 py-3">{tt('status')}</th>
                            <th scope="col" className="px-3 py-3">{tt('note')}</th>
                            <th scope="col" className="px-3 py-3">{tt('date')}</th>
                            <th scope="col" className="px-3 py-3">{ttt('global.operation')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings && currentBookings.length > 0 ?
                            currentBookings.map(bookingRequest => (
                                <tr className="bg-white border hover:bg-slate-50 overflow-x-auto" key={bookingRequest.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {bookingRequest.date} ({bookingRequest.time})
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-32'>
                                            {bookingRequest.supplier.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {bookingRequest.card_name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-28'>
                                            {bookingRequest.status}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {bookingRequest.note &&
                                            <div className={`h-5 text-xs md:text-sm w-36 cursor-pointer`} onClick={() => openTruncateTextModal(bookingRequest.note || 'No Data')}>
                                                {returnTruncateText(bookingRequest.note || '', 15)}
                                            </div>
                                        }
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(bookingRequest.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        {bookingRequest.status !== CONFIRMED && bookingRequest.status !== CANCELED && <Button className='bg-red-500 hover:bg-red-600' onClick={(e) => cancelBookingRequest(e, bookingRequest.id)}>{tt('cancel')}</Button>}
                                    </td>
                                </tr>
                            )) : currentBookings && currentBookings.length < 1 ?
                                <tr>
                                    <td>
                                        {tt('no-data')}
                                    </td>
                                </tr>
                                :
                                <Skeleton />
                        }
                    </tbody >
                </table >
            </div>
            <TablePagination data={bookingRequests || []} />
        </ul>
    )
}

const Skeleton = () => {

    const skeleton = useGlobalStore(s => s.skeleton)

    return (
        <>
            {skeleton.map(item => (
                <tr key={item}>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                    </td>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                    </td>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                    </td>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                    </td>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                    </td>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                    </td>
                    <td className='py-3.5 px-3'>
                        <div className='bg-slate-200 rounded-3xl animate-pulse w-20 h-5'></div>
                    </td>
                </tr>
            ))}
        </>
    )
}


export default ClientBookingRequest