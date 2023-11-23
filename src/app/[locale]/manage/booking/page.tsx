/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import BookingHeader from '@/components/super-admin/management/booking/BookingHeader';
import BookingTable from '@/components/super-admin/management/booking/BookingTable';
import DeleteBookingWarningModal from '@/components/super-admin/management/booking/DeleteBookingWarningModal';
import SearchBooking from '@/components/super-admin/management/booking/SearchBooking';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';



const Page: React.FC = () => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const { currentPage, isSideNavOpen, itemsPerPage, departmentID, setDepartmentID } = useAdminGlobalStore()

    const { bookings, getBookings, totalBooking, setTotalBooking, deleteBooking } = useAdminBookingStore()
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

    const filterBooking = bookings.filter((booking) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPrice = searchQuery.price.toUpperCase();
        const searchClient = searchQuery.client.toUpperCase()
        const searchSupplier = searchQuery.supplier.toUpperCase()
        const searchOperator = searchQuery.operator.toUpperCase();
        const searchStatus = searchQuery.status.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase();
        return (

            (searchName === '' || booking.name.toUpperCase().includes(searchName)) &&
            (searchPrice === '' || booking.price.toString().toUpperCase().includes(searchPrice)) &&
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

    const handleSearch = (e: any) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        getBookings()
    }, [departmentID])

    useEffect(() => {

        setTotalBooking({
            selected: '',
            searched: filterBooking.length.toString(),
            total: bookings.length.toString()
        })

    }, [bookings.length, filterBooking.length])

    useEffect(() => {
        setDepartmentID('')
    }, [])

    return (
        <div className='h-screen'>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <BookingHeader />

                <div className='flex w-full flex-col items-start gap-8 px-8'>

                    <div className='border gap-5 py-4 px-6 flex shadow bg-white w-full'>
                        <Departments />
                        <SearchBooking handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <BookingTable filteredTable={currentBookings} />

                </div>

                <Pagination totals={totalBooking} getTotalPages={getTotalPages} />

                {/* {viewCard && <ClientCardModal />} */}
                {deleteBooking && <DeleteBookingWarningModal />}

            </div>
        </div>
    )
};

export default Page;


