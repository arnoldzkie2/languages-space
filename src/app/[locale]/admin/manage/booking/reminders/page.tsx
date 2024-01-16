/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav';
import AdminRemindersTable from '@/components/admin/management/booking/reminders/AdminRemindersTable';
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import SearchBooking from '@/components/super-admin/management/booking/SearchBooking';
import DeleteRemindersWarningModal from '@/components/super-admin/management/booking/reminders/DeleteRemindersWarningModal';
import RemindersHeader from '@/components/super-admin/management/booking/reminders/RemindersHeader';
import RemindersTable from '@/components/super-admin/management/booking/reminders/RemindersTable';
import { Link } from '@/lib/navigation';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';



const Page: React.FC = () => {

    const { currentPage, isSideNavOpen, itemsPerPage, departmentID, setDepartmentID } = useGlobalStore()

    const { reminders, getReminders, totalReminders, setTotalReminders, deleteReminders } = useAdminBookingStore()
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


    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='h-screen'>

            <AdminSideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.reminders.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {permissions?.view_booking &&
                            <Link href={'/admin/manage/booking'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('booking.h1')}</div>
                            </Link>}
                        {permissions?.create_reminders &&
                            <Link href={'/admin/manage/booking/reminders/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('booking.reminders.create')}</div>
                            </Link>}
                    </ul>
                </nav>

                <div className='flex w-full flex-col items-start gap-8 px-8'>

                    <div className='border gap-5 py-4 px-6 flex shadow bg-white w-full'>
                        <SearchBooking handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <AdminRemindersTable filteredTable={currentBookings} />

                </div>

                <Pagination totals={totalReminders} getTotalPages={getTotalPages} />
                {deleteReminders && <DeleteRemindersWarningModal />}

            </div>
        </div>
    )
};

export default Page;


