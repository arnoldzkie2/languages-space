/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import ScheduleHeader from '@/components/super-admin/management/schedule/ScheduleHeader';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore';
import ScheduleComponent from '@/components/super-admin/management/schedule/ScheduleComponent';
import NewScheduleModal from '@/components/super-admin/management/schedule/NewScheduleModal';
import BindSchedlueModal from '@/components/super-admin/management/schedule/BindSchedlueModal';
import ViewScheduleModal from '@/components/super-admin/management/schedule/VIewScheduleModal';

const Page = ({ }) => {

    const [searchQuery, setSearchQuery] = useState('')

    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])

    const { isSideNavOpen, departmentID } = useAdminGlobalStore()

    const { getSupplier, supplier, supplierSelectedID, setSupplierSelectedID } = useAdminSupplierStore()

    const { getSchedule, schedules, currentDate, setCurrentDate, newSchedule, bindSchedule, openBindSchedule, openViewSchedule, viewSchedule } = useAdminScheduleStore()

    const filterSupplier = supplier.filter(item => item.name.toUpperCase().includes(searchQuery.toUpperCase()))

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

    const events = schedules.map(item => ({
        start: `${item.date}T${item.time}:00`,
        end: `${item.date}T${item.time}:01`,
        extendedProps: {
            data: item,
            viewSchedule: item.reserved ? openViewSchedule : openBindSchedule
        },
    }))

    useEffect(() => {

        getSupplier()

    }, [departmentID])

    useEffect(() => {

        if (supplierSelectedID && !newSchedule) {

            getSchedule(supplierSelectedID, currentDate.fromDate, currentDate.toDate)

        }

    }, [currentDate, supplierSelectedID])

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
                            {filterSupplier.length > 0 ? filterSupplier.map(item => (
                                <li onClick={() => setSupplierSelectedID(item.id)} className={`${supplierSelectedID === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'} rounded-md w-full py-1.5 cursor-pointer px-2`} key={item.id}>{item.name} ({item.user_name})</li>
                            )) : skeleton.map(item => (
                                <li key={item} className='bg-slate-200 animate-pulse min-h-[28px] rounded-xl w-full'></li>
                            ))}
                        </ul>
                    </div>

                    <div className='h-[51rem] overflow-y-auto w-full'>
                        <FullCalendar
                            plugins={[dayGridPlugin, listPlugin]}
                            eventContent={ScheduleComponent}
                            events={events}
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
            {bindSchedule && <BindSchedlueModal />}
            {viewSchedule && <ViewScheduleModal />}
        </>
    );
};

export default Page;

