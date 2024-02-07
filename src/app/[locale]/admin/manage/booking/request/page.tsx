/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import SearchBooking from '@/components/super-admin/management/booking/SearchBooking';
import BookingRequestHeader from '@/components/super-admin/management/booking/request/BookingRequestHeader';
import BookingRequestTable from '@/components/super-admin/management/booking/request/BookingRequestTable';
import DeleteBookingRequestModal from '@/components/super-admin/management/booking/request/DeleteBookingRequestModal';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import React, { ChangeEvent, useEffect, useState } from 'react';

const Page: React.FC = () => {

    const { departmentID, setDepartmentID } = useDepartmentStore()
    const { currentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()

    const { bookingRequests, getBookingRequests, totalBooking, setTotalBooking, deleteBookingRequestModal, selectedBookingRequests } = useAdminBookingStore()
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
            selected: selectedBookingRequests.length.toString(),
            searched: filterBooking.length.toString(),
            total: bookingRequests.length.toString()
        })

    }, [bookingRequests.length, filterBooking.length, selectedBookingRequests.length])

    useEffect(() => {
        setDepartmentID('')
    }, [])

    return (
        <div className='h-screen'>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <BookingRequestHeader />

                <div className='flex w-full flex-col items-start gap-8 px-8'>

                    <div className='border gap-5 py-4 px-6 flex shadow bg-card w-full'>
                        <Departments />
                        <SearchBooking handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
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


