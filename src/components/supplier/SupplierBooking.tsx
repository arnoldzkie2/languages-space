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

const SupplierBooking: React.FC = () => {

    const [currentBookings, setCurrentBookings] = useState<Booking[] | null>(null)

    const supplier = useSupplierStore(s => s.supplier)
    const getBookings = useSupplierBookingStore(s => s.getBookings)
    const bookings = useSupplierBookingStore(s => s.bookings)
    const skeleton = useGlobalStore(s => s.skeleton)
    const setPage = useSupplierStore(state => state.setPage)
    const { getCurrentData, currentPage } = useGlobalPaginationStore()

    useEffect(() => {
        setPage('bookings')
        if (!bookings && supplier?.id) getBookings()
    }, [supplier?.id])

    const t = useTranslations('client')
    const tt = useTranslations('global')

    useEffect(() => {
        setCurrentBookings(getCurrentData(bookings))
    }, [currentPage, bookings])

    return (
        <div className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
            <h1 className='text-blue-600 border-b mb-1 pb-1 text-lg font-bold'>{t('profile.my-bookings')}</h1>
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
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings && currentBookings.length > 0 ?
                            currentBookings.map(booking => (
                                <tr className="bg-white border hover:bg-slate-50" key={booking.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {booking.schedule.date} ({booking.schedule.time})
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-32'>
                                            {booking.supplier.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {booking.card_name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-24'>
                                            {booking.status}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {booking.note}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(booking.created_at).toLocaleString()}
                                        </div>
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
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                                        </td>
                                        <td className='py-3.5 px-3'>
                                            <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody >
                </table >
            </div>
            <TablePagination data={bookings || []} />
        </div>
    )
}

export default SupplierBooking