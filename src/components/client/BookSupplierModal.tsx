/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Err from '../global/Err'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { useTranslations } from 'next-intl'
import { SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import Success from '../global/Success'

const ClientBookingModal = () => {

    const router = useRouter()

    const [meetingInfo, setMeetingInfo] = useState<SupplierMeetingInfo[]>([])
    const { isLoading, setIsLoading, err, setErr, okMsg, setOkMsg } = useAdminGlobalStore()
    const { bookingFormData, setBookingFormData, closeBookingModal, getClientCards, getClientBookings } = useClientStore()
    const { cardCourses, supplierSchedule, setSupplierSchedule } = useAdminSupplierStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }

    const getSupplierSchedule = async () => {

        try {

            const { data } = await axios.get('/api/supplier/schedule', {
                params: { supplierID: bookingFormData.supplierID }
            })

            if (data.ok) setSupplierSchedule(data.data)

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const getSupplierMeetingInfo = async () => {
        try {

            const { data } = await axios.get('/api/supplier/meeting', {
                params: { supplierID: bookingFormData.supplierID }
            })

            if (data.ok) setMeetingInfo(data.data)

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                alert(error.response.data.msg)
            }
        }
    }

    const bookNow = async (e: React.FormEvent) => {
        e.preventDefault()

        const { courseID, supplierID, clientCardID, meetingInfoID, scheduleID } = bookingFormData
        if (!courseID) return setErr('Select Course')
        if (!supplierID) return setErr('Select Supplier')
        if (!clientCardID) return setErr('Select Card')
        if (!meetingInfoID) return setErr("Select Meeting Info")
        if (!scheduleID) return setErr('Select Schedule')

        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/client/booking', bookingFormData)

            if (data.ok) {
                setOkMsg('Success Redirecting...')
                getClientBookings()
                getClientCards()
                setTimeout(() => {
                    setIsLoading(false)
                    closeBookingModal()
                    router.push('/client/profile/bookings')
                }, 3000)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    useEffect(() => {

        if (!bookingFormData.clientCardID) {
            closeBookingModal()
            alert('Select Card First')
        }

        if (bookingFormData.supplierID) {
            getSupplierMeetingInfo()
            getSupplierSchedule()
        }

    }, [bookingFormData.supplierID])
    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    return (
        <div className='fixed top-0 right-0 h-screen w-screen bg-black z-20 bg-opacity-40 flex items-center justify-center py-20 px-5'>
            <form onSubmit={bookNow} className='flex flex-col gap-4 p-10 text-gray-700 bg-white rounded-md w-full sm:w-96 shadow relative'>
                <FontAwesomeIcon icon={faXmark} width={16} height={16} className='absolute right-4 top-4 text-lg cursor-pointer' onClick={closeBookingModal} />
                <h1 className='text-xl font-black text-center w-full border-b pb-3 mb-2'>{t('booking.fillup')}</h1>
                <Success />
                <Err />
                <div className='flex flex-col gap-2'>
                    <label htmlFor="meetingInfo" className='px-1 font-medium'>{tt('meeting')}</label>
                    <select name="meetingInfoID" id="meetingInfo" onChange={handleChange} value={bookingFormData.meetingInfoID} className='px-3 py-1.5 rounded-sm w-full outline-none'>
                        <option value="" disabled>{ttt('supplier.select-meeting')}</option>
                        {meetingInfo.length > 0 && meetingInfo.map(info => (
                            <option value={info.id} key={info.id}>{info.service} ({info.meeting_code})</option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="courseID" className='px-1 font-medium'>{tt('course')}</label>
                    <select name="courseID" id="courseID" onChange={handleChange} value={bookingFormData.courseID} className='px-3 py-1.5 rounded-sm w-full outline-none'>
                        <option value="" disabled>{ttt('booking.select-course')}</option>
                        {cardCourses.length > 0 && cardCourses.map(course => (
                            <option value={course.id} key={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="scheduleID" className='px-1 font-medium'>{tt('schedule')}</label>
                    <select name="scheduleID" id="scheduleID" onChange={handleChange} value={bookingFormData.scheduleID} className='px-3 py-1.5 rounded-sm w-full outline-none'>
                        <option value="" disabled>{ttt('booking.select-schedule')}</option>
                        {supplierSchedule.length > 0 && supplierSchedule.map(schedule => (
                            <option value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time})</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="note" className='px-1 font-medium'>{tt('note')}</label>
                    <input type="text" name='note' value={bookingFormData.note} onChange={handleChange} className='px-3 py-1 border outline-none rounded-sm' placeholder={`${tt('note')} ${tt('optional')}`} />
                </div>

                <div className='w-full flex items-center gap-5 mt-auto'>
                    <button type='button' onClick={closeBookingModal} className='w-full py-1.5 border rounded-md hover:bg-slate-50'>{tt('close')}</button>
                    <button disabled={isLoading} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white w-full py-1.5 rounded-md`}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('confirm')}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default ClientBookingModal