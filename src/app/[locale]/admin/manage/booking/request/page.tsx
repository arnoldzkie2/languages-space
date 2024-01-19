/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav';
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import DownloadTable from '@/components/super-admin/management/DownloadTable';
import Pagination from '@/components/super-admin/management/Pagination';
import BookingHeader from '@/components/super-admin/management/booking/BookingHeader';
import SearchBooking from '@/components/super-admin/management/booking/SearchBooking';
import BookingRequestTable from '@/components/super-admin/management/booking/request/BookingRequestTable';
import DeleteBookingRequestModal from '@/components/super-admin/management/booking/request/DeleteBookingRequestModal';
import { Link } from '@/lib/navigation';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent, useEffect, useState } from 'react';



const Page: React.FC = () => {

    const { currentPage, isSideNavOpen, itemsPerPage, departmentID, setDepartmentID } = useGlobalStore()

    const { bookingRequests, getBookingRequests, totalBooking, selectedBookingRequests, setTotalBooking, deleteBookingRequestModal } = useAdminBookingStore()
    const permissions = useAdminPageStore(s => s.permissions)
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        operator: '',
        price: '',
        status: '',
        client: '',
        supplier: '',
        schedule: '',
        note: '',
    })

    const filterBooking = bookingRequests.filter((booking) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchClient = searchQuery.client.toUpperCase()
        const searchSupplier = searchQuery.supplier.toUpperCase()
        const searchOperator = searchQuery.operator.toUpperCase();
        const searchStatus = searchQuery.status.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase();
        return (

            (searchName === '' || booking.name.toUpperCase().includes(searchName)) &&
            (searchOperator === '' || booking.operator.toUpperCase().includes(searchOperator)) &&
            (searchClient === '' || booking.client.name.toUpperCase().includes(searchClient)) &&
            (searchSupplier === '' || booking.supplier.name.toUpperCase().includes(searchSupplier)) &&
            (searchNote === '' || booking.note?.toUpperCase().includes(searchNote)) &&
            (searchStatus === '' || booking.status.toUpperCase().includes(searchStatus))
        );
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentBookings = filterBooking.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filterBooking.length / itemsPerPage)

    const handleSearch = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        getBookingRequests()
    }, [departmentID])

    useEffect(() => {

        setTotalBooking({
            selected: '',
            searched: filterBooking.length.toString(),
            total: bookingRequests.length.toString()
        })

    }, [bookingRequests.length, filterBooking.length])

    useEffect(() => {
        setDepartmentID('')
    }, [])

    const t = useTranslations('super-admin')

    return (
        <div className='h-screen'>
            <AdminSideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>


                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.request.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {permissions?.view_reminders &&
                            <Link href={'/admin/manage/booking/reminders'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('booking.reminders.h2')}</div>
                            </Link>}
                            {permissions?.create_booking &&
                            <Link href={'/admin/manage/booking/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('booking.create')}</div>
                            </Link>}
                        {permissions?.download_table &&
                            <DownloadTable tables={bookingRequests} selectedTable={selectedBookingRequests} />
                        }
                    </ul>
                </nav>
                <div className='flex w-full flex-col items-start gap-8 px-8'>

                    <div className='border gap-5 py-4 px-6 flex shadow bg-white w-full'>
                        <Departments />
                        <SearchBooking handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <BookingRequestTable filteredTable={currentBookings} />

                </div>

                <Pagination totals={totalBooking} getTotalPages={getTotalPages} />

                {deleteBookingRequestModal && <DeleteBookingRequestModal />}

            </div>
        </div>
    )
};

export default Page;


