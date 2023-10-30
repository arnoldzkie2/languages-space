/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Pagination from '@/components/super-admin/management/Pagination';
import BookingHeader from '@/components/super-admin/management/booking/BookingHeader';
import BookingTable from '@/components/super-admin/management/booking/BookingTable';
import SearchBooking from '@/components/super-admin/management/booking/SearchBooking';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import React, { useEffect, useState } from 'react';



const Page: React.FC = () => {

    const { currentPage, isSideNavOpen, itemsPerPage } = useAdminGlobalStore()

    const { bookings, getBookings, totalBooking, setTotalBooking } = useAdminBookingStore()
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        operator: '',
        price: '',
        status: '',
        note: '',
    })

    const filterBooking = bookings.filter((booking) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPrice = searchQuery.price.toUpperCase();
        const searchOperator = searchQuery.operator.toUpperCase();
        const searchStatus = searchQuery.status.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase();
        return (

            (searchName === '' || booking.name.toUpperCase().includes(searchName)) &&
            (searchPrice === '' || booking.price.toString().toUpperCase().includes(searchPrice)) &&
            (searchOperator === '' || booking.operator.toUpperCase().includes(searchOperator)) &&
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
    }, [])

    useEffect(() => {

        setTotalBooking({
            selected: '',
            searched: filterBooking.length.toString(),
            total: bookings.length.toString()
        })

    }, [bookings.length, filterBooking.length])

    return (
        <div className='h-screen'>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <BookingHeader />

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchBooking handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                <BookingTable filteredTable={currentBookings} />

                </div>

                <Pagination totals={totalBooking} getTotalPages={getTotalPages} />

                {/* {viewCard && <ClientCardModal />} */}
                {/* {deleteCardModal && <DeleteCardWarningModal />} */}
            </div>
        </div>
    )
};

export default Page;


