/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import ScheduleHeader from '@/components/super-admin/management/schedule/ScheduleHeader';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore';
import ScheduleComponent from '@/components/super-admin/management/schedule/ScheduleComponent';
import NewScheduleModal from '@/components/super-admin/management/schedule/NewScheduleModal';
import ViewBokingModal from '@/components/super-admin/management/schedule/ViewBokingModal';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import useGlobalStore from '@/lib/state/globalStore';
import ScheduleBookingModal from '@/components/super-admin/management/schedule/ScheduleBookingModal';

const Page = ({ }) => {

    const [searchQuery, setSearchQuery] = useState('')
    const { isSideNavOpen, departmentID, skeleton } = useGlobalStore()
    const { getSupplierWithMeeting, supplier } = useAdminSupplierStore()
    const { setBookingFormData, bookingFormData } = useAdminBookingStore()
    const { getSchedule, schedules, currentDate, setCurrentDate, newSchedule, bindSchedule, openBindSchedule, openViewBooking, viewBooking } = useAdminScheduleStore()

    const filterSupplier = supplier.filter(supplier => supplier.name.toUpperCase().includes(searchQuery.toUpperCase()))

    const formatDate = (date: any) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleCalendarDateChange = (arg: any) => {

        const startStr = arg.startStr;
        const endStr = arg.endStr;

        const startDate = new Date(startStr);
        const endDate = new Date(endStr);

        const fromDate = formatDate(startDate);
        const toDate = formatDate(endDate);

        setCurrentDate({
            fromDate: fromDate,
            toDate: toDate
        });
    }

    const events = schedules && schedules.map(supplier => ({
        start: `${supplier.date}T${supplier.time}:00`,
        end: `${supplier.date}T${supplier.time}:01`,
        extendedProps: {
            data: supplier,
            viewBooking: openViewBooking,
            openBindSchedule
        },
    }))

    useEffect(() => {
        getSupplierWithMeeting()
    }, [departmentID])

    useEffect(() => {
        if (bookingFormData.supplierID && !newSchedule && currentDate.fromDate && currentDate.toDate) getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
    }, [currentDate, bookingFormData.supplierID])

    const t = useTranslations('super-admin')

    return (
        <>
            <SideNav />

            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <ScheduleHeader />

                <div className='flex w-full items-start h-full gap-8 px-8 pb-8'>

                    <div className='border py-3 px-6 flex flex-col gap-4 shadow bg-white w-1/6'>
                        <Departments />
                        <input value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} type="text" className='border outline-none py-1.5 px-3' placeholder={t('supplier.search')} />
                        <ul className='flex flex-col pr-2 h-[42rem] gap-3 overflow-y-auto py-2 text-gray-600'>
                            {filterSupplier.length > 0 ? filterSupplier.map(supplier => (
                                <li onClick={() => setBookingFormData({ ...bookingFormData, supplierID: supplier.id })} className={`${bookingFormData.supplierID === supplier.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'} rounded-md w-full py-1.5 cursor-pointer px-2`} key={supplier.id}>{supplier.name}</li>
                            )) : skeleton.map(supplier => (
                                <li key={supplier} className='bg-slate-200 animate-pulse min-h-[28px] rounded-xl w-full'></li>
                            ))}
                        </ul>
                    </div>

                    <div className='h-[51rem] overflow-y-auto w-full'>
                        <FullCalendar
                            plugins={[dayGridPlugin, listPlugin]}
                            eventContent={ScheduleComponent}
                            events={events!}
                            initialView='dayGridWeek'
                            headerToolbar={{
                                start: 'prev,next today',
                                center: 'title',
                                end: 'dayGridMonth,dayGridWeek,listWeek'
                            }}
                            datesSet={(arg) => handleCalendarDateChange(arg)}
                        />
                    </div>

                </div>

            </div>

            {newSchedule && <NewScheduleModal />}
            {bindSchedule && <ScheduleBookingModal />}
            {viewBooking && <ViewBokingModal />}
        </>
    );
};

export default Page;

