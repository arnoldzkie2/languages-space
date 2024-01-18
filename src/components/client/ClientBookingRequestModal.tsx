/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import useClientStore from '@/lib/state/client/clientStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Err from '../global/Err'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { useTranslations } from 'next-intl'
import Success from '../global/Success'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import useGlobalStore from '@/lib/state/globalStore'
const ClientBookingRequestModal = () => {

    const router = useRouter()

    const { isLoading } = useGlobalStore()
    const clearAvailableSuppliers = useClientStore(state => state.clearAvailableSuppliers)
    const { closeBookingRequestModal, createBookingRequest } = useClientBookingStore()
    const { bookingFormData, setBookingFormData } = useAdminBookingStore()
    const { supplierMeetingInfo, getSupplierMeetingInfo, cardCourses } = useAdminSupplierStore()
    const bookingRequestModal = useClientBookingStore(state => state.bookingRequestModal)

    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }
    const handleScheduleChange = (newSelectedDate: DateObject | DateObject[] | null) => {
        setBookingFormData({ ...bookingFormData, scheduleID: '' })
        if (newSelectedDate) setSelectedDate(newSelectedDate.toString())
    }

    useEffect(() => {

        if (!bookingFormData.clientCardID && bookingRequestModal) {
            closeBookingRequestModal()
            clearAvailableSuppliers()
            alert('Select Card First')
        }

        if (bookingFormData.supplierID) {
            getSupplierMeetingInfo(bookingFormData.supplierID)
        }

    }, [bookingFormData.supplierID, bookingRequestModal])

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    console.log(selectedTime)

    if (!bookingRequestModal) return null

    return (
        <div className='fixed top-0 right-0 h-screen w-screen bg-black z-20 bg-opacity-40 flex items-center justify-center py-20 px-5'>
            <form onSubmit={(e) => createBookingRequest(e, { router, time: selectedTime, date: selectedDate })} className='flex flex-col gap-4 p-10 text-gray-700 bg-white rounded-md w-full sm:w-96 shadow relative'>
                <FontAwesomeIcon icon={faXmark} width={16} height={16} className='absolute right-4 top-4 text-lg cursor-pointer' onClick={closeBookingRequestModal} />
                <h1 className='text-xl font-black text-center w-full border-b pb-3 mb-2'>{t('booking.fillup')}</h1>
                <Success />
                <Err />
                <div className='flex flex-col gap-2'>
                    <label htmlFor="meetingInfo" className='px-1 font-medium'>{tt('meeting')}</label>
                    <select name="meetingInfoID" id="meetingInfo" onChange={handleChange} value={bookingFormData.meetingInfoID} className='px-3 py-1.5 rounded-sm w-full outline-none'>
                        <option value="" disabled>{ttt('supplier.select-meeting')}</option>
                        {supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(info => (
                            <option value={info.id} key={info.id}>{info.service} ({info.meeting_code})</option>
                        )) :
                            <option disabled>{tt('loading')}</option>}
                    </select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="courseID" className='px-1 font-medium'>{tt('course')}</label>
                    <select name="courseID" id="courseID" onChange={handleChange} value={bookingFormData.courseID} className='px-3 py-1.5 rounded-sm w-full outline-none'>
                        <option value="" disabled>{ttt('booking.select-course')}</option>
                        {cardCourses && cardCourses.length > 0 ? cardCourses.map(course => (
                            <option value={course.id} key={course.id}>{course.name}</option>
                        )) :
                            <option disabled>{tt('loading')}</option>}
                    </select>
                </div>

                <div className='flex flex-col mt-3 pt-3 border-t gap-2'>
                    <label htmlFor="" className='px-1 font-medium w-full text-center'>{ttt('schedule.select')}</label>
                    <div className='flex w-full flex-col gap-2'>
                        <DatePicker
                            placeholder='Select Date'
                            format="YYYY-MM-DD"
                            value={selectedDate}
                            onChange={handleScheduleChange}
                            style={{ height: '40px', width: '100%', paddingLeft: '12px' }}
                        />
                        <input type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className='py-2 outline-none px-3 border rounded-md cursor-pointer'
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="note" className='px-1 font-medium'>{tt('note')}</label>
                    <input type="text" name='note' value={bookingFormData.note} onChange={handleChange} className='px-3 py-1 border outline-none rounded-sm' placeholder={`${tt('note')} ${tt('optional')}`} />
                </div>

                <div className='w-full flex items-center gap-5 mt-auto'>
                    <button type='button' onClick={closeBookingRequestModal} className='w-full py-1.5 border rounded-md hover:bg-slate-50'>{tt('close')}</button>
                    <button disabled={isLoading} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white w-full py-1.5 rounded-md`}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('confirm')}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default ClientBookingRequestModal