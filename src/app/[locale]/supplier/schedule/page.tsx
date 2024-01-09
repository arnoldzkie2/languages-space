/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SupplierHeader from '@/components/supplier/SupplierHeader'
import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import ScheduleComponent from '@/components/supplier/ScheduleComponent';
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { useTranslations } from 'next-intl'
import CreateScheduleModal from '@/components/supplier/CreateScheduleModal'
import Success from '@/components/global/Success'
import BookingModal from '@/components/supplier/BookingModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
import useGlobalStore from '@/lib/state/globalStore'
import RequestCancelBookingModal from '@/components/client/RequestCancelBookingModal'

const Page = () => {

  const { schedules, setCurrentDate, getSchedule, currentDate, newSchedule, toggleSchedule, deleteSupplierSchedule } = useAdminScheduleStore()
  const { isLoading } = useGlobalStore()
  const supplier = useSupplierStore(state => state.supplier)
  const { viewBooking, bookingModal, requestCancelBooking } = useSupplierBookingStore()

  const events = schedules.map(supplier => ({
    start: `${supplier.date}T${supplier.time}:00`,
    end: `${supplier.date}T${supplier.time}:01`,
    extendedProps: {
      data: supplier,
      deleteSupplierSchedule,
      isLoading, viewBooking
    },
  }))

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

    if (supplier && currentDate.fromDate !== fromDate) getSchedule(supplier.id, fromDate, toDate)

    setCurrentDate({
      fromDate: fromDate,
      toDate: toDate
    })
  }

  const t = useTranslations('super-admin')

  return (
    <>
      <SupplierHeader />
      <div className='padding py-24 w-full h-full flex flex-col'>
        <div className='flex w-full justify-end gap-5 py-5 items-center'>
          <Success />
          <button onClick={toggleSchedule} className='py-2 px-6 hover:bg-blue-500 bg-blue-600 text-white rounded-md'>{t('schedule.create')}</button>
        </div>
        {supplier ? <FullCalendar
          plugins={[dayGridPlugin, listPlugin]}
          eventContent={ScheduleComponent}
          events={events}
          initialDate={currentDate.fromDate || new Date()}
          initialView='dayGridWeek'
          headerToolbar={{
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,dayGridWeek,listWeek'
          }}
          datesSet={(arg) => {
            handleCalendarDateChange(arg)
          }}
        /> : <div className='flex w-full h-full items-center justify-center'>
          <FontAwesomeIcon icon={faSpinner} width={28} height={28} className='animate-spin w-7 h-7' />
        </div>}
      </div>
      {newSchedule && <CreateScheduleModal />}
      {bookingModal && <BookingModal />}
    </>
  )
}

export default Page