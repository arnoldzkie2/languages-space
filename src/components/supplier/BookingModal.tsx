/* eslint-disable react-hooks/exhaustive-deps */

'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import Err from '../global/Err'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
import useGlobalStore from '@/lib/state/globalStore'

const BookingModal = () => {

    const { bookingID, closeBooking, getSingleBooking, singleBooking, requestCancelBooking } = useSupplierBookingStore()
    const { copy } = useGlobalStore()

    useEffect(() => {
        getSingleBooking()
    }, [bookingID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='fixed w-screen h-screen top-0 left-0 flex items-center text-gray-700 justify-center padding z-20 bg-black bg-opacity-25'>

            {singleBooking ?

                <div className='p-5 sm:p-10 bg-white shadow rounded-md w-full sm:w-96 break-words flex flex-col gap-3'>
                    <Err />
                    <div className='flex items-center gap-2'>
                        <label htmlFor="client" className='font-bold'>{tt('client')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {singleBooking?.client.name} ({singleBooking.client.username})</div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="meeting" className='font-bold'>{tt('meeting')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {singleBooking?.meeting_info.service} <strong className='cursor-pointer text-blue-600' title='Copy' onClick={() => copy(singleBooking?.meeting_info.meeting_code || '')}>{singleBooking?.meeting_info.meeting_code}</strong></div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="schedule" className='font-bold'>{tt('schedule')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {`${singleBooking?.schedule.date} at ${singleBooking.schedule.time}`}</div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="status" className='font-bold'>{tt('status')}</label>
                        <div className='text-gray-600 text-sm uppercase'>{'->'} {singleBooking?.status}</div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="course" className='font-bold'>{tt('course')}</label>
                        <div className='text-gray-600 text-sm'>{'->'} {singleBooking?.course.name}</div>
                    </div>
                    <div className='flex flex-col gap-2 pb-3 mb-3 border-b'>
                        <label htmlFor="note" className='font-bold'>{tt('note')} {'->'}</label>
                        <div className='text-gray-600 text-sm'>{singleBooking?.note}</div>
                    </div>
                    <div title='Close' onClick={closeBooking} className='cursor-pointer border w-full flex items-center justify-center rounded-md py-1 hover:bg-slate-100'>{tt('close')}</div>
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