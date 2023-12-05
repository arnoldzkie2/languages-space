/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { Booking } from '@/lib/types/super-admin/bookingType'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'

const ClientBookings: React.FC = () => {

    const { bookings, getClientBookings } = useClientStore()

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    const { setPage } = useClientStore()
    const { skeleton, currentPage, setCurrentPage, itemsPerPage } = useAdminGlobalStore()
    const getTotalPages = () => {

        if (bookings) {
            return Math.ceil(bookings.length / itemsPerPage)
        } else {
            return 1
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentBookings = bookings && bookings.slice(indexOfFirstItem, indexOfLastItem)


    const goToPreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(currentPage - 1);
        }

    }

    const goToNextPage = () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    useEffect(() => {
        setPage('bookings')
        if (!bookings) {
            getClientBookings()
        }
    }, [])

    return (
        <ul className='flex flex-col gap-3 w-full md:w-2/3 order-1 md:order-2'>
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
                                            {booking.schedule[0].date} ({booking.schedule[0].time})
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
            <footer className={`flex mt-auto min-h-[80px] items-center justify-between border-t text-xs lg:text-md`}>
                <div className='sm:flex items-center gap-3 w-44 lg:w-56 hidden'>
                    <div className='font-medium'>
                        {ttt('pagination.page')} {currentPage} of {getTotalPages()}
                    </div>
                    <input
                        type='text'
                        className='outline-none border px-3 py-1 w-1/3 lg:w-2/5'
                        placeholder={ttt('pagination.goto')}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setCurrentPage(isNaN(value) ? 1 : value);
                        }}
                    />
                </div>

                <div className='flex items-center mr-auto'>
                    <div className='font-medium'>{ttt('global.total')} <span className='font-black text-gray-600'>{bookings && bookings.length}</span></div>
                </div>

                <div className='flex items-center gap-5 h-full'>
                    <button onClick={goToPreviousPage}
                        className={`w-20 lg:w-32 border h-8 rounded-md ${currentPage !== 1 && 'hover:bg-blue-600 hover:text-white'}`}
                        disabled={currentPage === 1}>
                        {ttt('pagination.prev')}
                    </button>
                    <button onClick={goToNextPage}
                        className={`w-20 lg:w-32 border h-8 rounded-md ${currentPage !== getTotalPages() && 'hover:bg-blue-600 hover:text-white'}`}
                        disabled={currentPage === getTotalPages()}>
                        {ttt('pagination.next')}
                    </button>
                </div>

            </footer>
        </ul>
    )
}

export default ClientBookings