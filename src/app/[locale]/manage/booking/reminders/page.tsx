/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import SearchBooking from '@/components/super-admin/management/booking/SearchBooking';
import ConfirmBookingModal from '@/components/super-admin/management/booking/reminders/ConfirmBookingModal';
import DeleteRemindersWarningModal from '@/components/super-admin/management/booking/reminders/DeleteRemindersWarningModal';
import RemindersHeader from '@/components/super-admin/management/booking/reminders/RemindersHeader';
import RemindersTable from '@/components/super-admin/management/booking/reminders/RemindersTable';
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

    const { reminders, getReminders, totalReminders, setTotalReminders, deleteReminders, confirmBooking } = useAdminBookingStore()

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

    const filterReminders = reminders.filter((booking) => {

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

    const currentBookings = filterReminders.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filterReminders.length / itemsPerPage)

    const handleSearch = (e: any) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        getReminders()
    }, [departmentID])

    useEffect(() => {

        setTotalReminders({
            selected: '',
            searched: filterReminders.length.toString(),
            total: reminders.length.toString()
        })

    }, [reminders.length, filterReminders.length])

    useEffect(() => {
        setDepartmentID('')
    }, [])

    return (
        <div className='h-screen'>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <RemindersHeader />

                <div className='flex w-full flex-col items-start gap-8 px-8'>

                    <div className='border gap-5 py-4 px-6 flex shadow bg-white w-full'>
                        <Departments />
                        <SearchBooking handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <RemindersTable filteredTable={currentBookings} />

                </div>

                <Pagination totals={totalReminders} getTotalPages={getTotalPages} />

                {/* {viewCard && <ClientCardModal />} */}
                {deleteReminders && <DeleteRemindersWarningModal />}
                {confirmBooking && <ConfirmBookingModal />}

            </div>
        </div>
    )
};

export default Page;


