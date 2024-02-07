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
import ViewBokingModal from '@/components/super-admin/management/schedule/ViewBokingModal';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import useGlobalStore from '@/lib/state/globalStore';
import ScheduleBookingModal from '@/components/super-admin/management/schedule/ScheduleBookingModal';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

const Page = ({ }) => {

    const departmentID = useDepartmentStore(s => s.departmentID)
    const { isSideNavOpen } = useGlobalStore()
    const { getSupplierWithMeeting, supplierWithMeeting } = useAdminSupplierStore()
    const { setBookingFormData, bookingFormData } = useAdminBookingStore()
    const { getSchedule, schedules, currentDate, setCurrentDate, newSchedule, bindSchedule, openBindSchedule, openViewBooking, viewBooking } = useAdminScheduleStore()

    const [openSupplier, setOpenSupplier] = useState(false)

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
    const tt = useTranslations("global")

    return (
        <>
            <SideNav />

            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <ScheduleHeader />

                <div className='flex w-full items-start h-full gap-8 px-8 pb-8'>

                    <div className='border py-3 px-6 flex flex-col gap-4 shadow bg-card w-1/6'>
                        <Departments />

                        <div className='flex w-full flex-col gap-1.5'>
                            <Label>{tt('supplier')}</Label>
                            <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openSupplier}
                                        className={cn(
                                            "w-full justify-between",
                                            !bookingFormData.supplierID && "text-muted-foreground"
                                        )}
                                    >
                                        {bookingFormData.supplierID
                                            ? supplierWithMeeting.find((supplier) => supplier.id === bookingFormData.supplierID)?.name
                                            : t('supplier.select')}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder={t('supplier.search')}
                                            className="h-9"
                                        />
                                        <CommandEmpty>{t('supplier.404')}</CommandEmpty>
                                        <CommandGroup>
                                            {supplierWithMeeting.length > 0 ? supplierWithMeeting.map(supplier => (
                                                <CommandItem
                                                    key={supplier.id}
                                                    className={`${bookingFormData.supplierID === supplier.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    value={supplier.name}
                                                    onSelect={() => {
                                                        setBookingFormData({ ...bookingFormData, supplierID: supplier.id })
                                                        setOpenSupplier(false)
                                                    }}
                                                >
                                                    {supplier.name}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            bookingFormData.supplierID === supplier.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            )) : <CommandItem>{t('supplier.404')}</CommandItem>}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
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

            {bindSchedule && <ScheduleBookingModal />}
            {viewBooking && <ViewBokingModal />}
        </>
    );
};

export default Page;

