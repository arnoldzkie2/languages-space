'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import axios from 'axios'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { Booking } from '@/lib/types/super-admin/bookingType'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'

const ViewBokingModal = () => {

    const { closeViewBooking, getSchedule, currentDate, bookingID } = useAdminScheduleStore()
    const { isLoading, setIsLoading } = useAdminGlobalStore()
    const { bookingFormData } = useAdminBookingStore()

    const [bookingData, setBookingData] = useState<Booking | null>(null)

    const cancelBooking = async (e: React.MouseEvent) => {

        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: {
                    bookingID,
                    type: 'cancel'
                }
            })

            if (data.ok) {
                axios.post('/api/email/booking/cancel', { bookingID: data.data, operator: 'admin' })
                setIsLoading(false)
                closeViewBooking()
                getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error)
            alert('Something went wrong')
        }
    }

    const retrieveBooking = async () => {
        try {

            const { data } = await axios.get('/api/booking', {
                params: { bookingID }
            })

            if (data.ok) setBookingData(data.data)

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    const deleteSchedule = async (e: React.MouseEvent, scheduleID: string) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const { data } = await axios.delete('/api/schedule', {
                params: { scheduleID }
            })

            if (data.ok) {
                setIsLoading(false)
                getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
                alert('Success')
                closeViewBooking()
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }

            alert('Something went wrong')

        }

    }

    useEffect(() => {
        if (bookingID) retrieveBooking()
    }, [bookingID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen flex bg-opacity-50 bg-gray-600'>
            <div className='w-full h-full cursor-pointer' title='Close' onClick={closeViewBooking}></div>
            <div className='bg-white p-10 shadow-lg flex items-start gap-10 overflow-y-auto w-full h-full relative'>
                <FontAwesomeIcon onClick={closeViewBooking} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex w-1/2 flex-col gap-3.5 p-5 border'>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('schedule')}:</span>{bookingData?.schedule.date} ({bookingData?.schedule.time})</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('client')}:</span>{bookingData?.client.name}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('card')}:</span>{bookingData?.card_name}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('meeting')}:</span>{bookingData?.meeting_info?.service} <span title='Click to Copy' className='cursor-pointer hover:text-blue-600' onClick={() => {
                        const meetingCode = bookingData?.meeting_info?.meeting_code
                        if (meetingCode) {
                            navigator.clipboard.writeText(meetingCode)
                            alert(`Copied ${meetingCode}`)
                        }
                    }} >{bookingData?.meeting_info?.meeting_code}</span></div>

                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('quantity')}:</span>{bookingData?.quantity}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('price')}:</span>{bookingData?.price}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('note')}:</span>{bookingData?.note}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>{tt('status')}:</span>{bookingData?.status}</div>
                    <div className='flex items-center w-full gap-5'>
                        <button onClick={closeViewBooking} className='py-2 rounded-md border w-full hover:bg-slate-50'>{tt('close')}</button>
                        <div className='flex flex-col w-full gap-5'>
                            <button onClick={(e) => cancelBooking(e)} disabled={isLoading}
                                className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>
                                {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('cancel')}</button>
                            <button onClick={(e) => deleteSchedule(e, bookingData?.scheduleID!)} disabled={isLoading}
                                className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>
                                {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('schedule.delete')}</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBokingModal