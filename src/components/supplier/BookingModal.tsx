/* eslint-disable react-hooks/exhaustive-deps */

'use client'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { Booking } from '@/lib/types/super-admin/bookingType'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Err from '../global/Err'

const BookingModal = () => {

    const [booking, setBooking] = useState<Booking | null>(null)
    const [cancel, setCancel] = useState(false)

    const { bookingID, closeBooking, supplier } = useSupplierStore()
    const { copy, isLoading, setIsLoading, setErr, setOkMsg } = useAdminGlobalStore()
    const { currentDate, getSchedule } = useAdminScheduleStore()

    const getBooking = async () => {

        try {

            const { data } = await axios.get('/api/booking', { params: { bookingID } })
            if (data.ok) setBooking(data.data)

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    useEffect(() => {
        getBooking()
    }, [bookingID])

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
                setIsLoading(false)
                closeBooking()
                setOkMsg('Booking Canceled')
                axios.post('/api/email/booking/cancel', { bookingID: data.data, operator: 'supplier' })
                getSchedule(supplier?.id!, currentDate.fromDate, currentDate.toDate)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    return (
        <div className='fixed w-screen h-screen top-0 left-0 flex items-center text-gray-700 justify-center padding z-20 bg-black bg-opacity-25'>

            {booking ?

                <div className='p-5 sm:p-10 bg-white shadow rounded-md w-full sm:w-96 flex flex-col gap-3'>
                    <Err />
                    <div className='flex items-center gap-2'>
                        <label htmlFor="client" className='font-bold'>{tt('client')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {booking?.client.name} ({booking.client.username})</div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="meeting" className='font-bold'>{tt('meeting')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {booking?.meeting_info.service} <strong className='cursor-pointer text-blue-600' title='Copy' onClick={() => copy(booking?.meeting_info.meeting_code || '')}>{booking?.meeting_info.meeting_code}</strong></div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="schedule" className='font-bold'>{tt('schedule')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {`${booking?.schedule.date} at ${booking.schedule.time}`}</div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="status" className='font-bold'>{tt('status')}</label>
                        <div className='text-gray-600 text-sm uppercase'>{'->'} {booking?.status}</div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="course" className='font-bold'>{tt('course')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {booking?.course.name}</div>
                    </div>
                    <div className='flex flex-col gap-2 pb-3 mb-3 border-b'>
                        <label htmlFor="note" className='font-bold'>{tt('note')}:</label>
                        <div className='text-gray-600 text-sm'>{'-> '}{booking?.note}</div>
                    </div>
                    {cancel ?
                        <div className='flex mt-3 w-full gap-5 flex-col'>
                            <div className='text-center'>{t('booking.cancel')}</div>
                            <div className='flex items-center w-full gap-5'>
                                <button onClick={() => setCancel(false)} className='border w-full flex items-center justify-center py-1 rounded-md hover:bg-slate-100'>{t('global.confirm-cancel')}</button>
                                <button disabled={isLoading} onClick={cancelBooking}
                                    className={`border-red-500 ${isLoading ? 'bg-red-400' : 'bg-red-500 hover:bg-red-400'} flex w-full py-1 rounded-md items-center justify-center text-white`}>
                                    {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('global.delete-confirm')}
                                </button>
                            </div>
                        </div>
                        :
                        <div className='flex items-center gap-5  w-full'>
                            {booking.status !== 'canceled' && <div title='Cancel Booking' onClick={() => setCancel(true)}
                                className='cursor-pointer border border-red-500 w-full flex items-center justify-center rounded-md py-1 hover:bg-red-400 bg-red-500 text-white self-end'>{tt('cancel')}</div>}
                            <div title='Close' onClick={closeBooking} className='cursor-pointer border w-full flex items-center justify-center rounded-md py-1 hover:bg-slate-100'>{tt('close')}</div>
                        </div>
                    }
                </div>
                :
                <div className='p-16 bg-white shadow rounded-full flex items-center justify-center'>
                    <FontAwesomeIcon icon={faSpinner} width={30} height={30} className='animate-spin w-[30px] h-[30px]' />
                </div>
            }
        </div >

    )
}

export default BookingModal