'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import axios from 'axios'
import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Booking } from '@/lib/types/super-admin/bookingType'

const ViewBokingModal = () => {

    const { closeViewBooking, getSchedule, currentDate, bookingID } = useAdminScheduleStore()

    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const [bookingData, setBookingData] = useState<Booking>()
    const [clientCard, setClientCard] = useState<ClientCard>()

    const { supplierSelectedID } = useAdminSupplierStore()

    const cancelBooking = async (e: any) => {

        e.preventDefault()

        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: {
                    bookingID: bookingID,
                    type: 'cancel'
                }
            })

            if (data.ok) {
                setIsLoading(false)
                closeViewBooking()
                getSchedule(supplierSelectedID, currentDate.fromDate, currentDate.toDate)
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

            if (data.ok) {
                setBookingData(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    const retrieveClientCard = async () => {
        try {

            const { data } = await axios.get('/api/client/card', {
                params: { cardID: bookingData?.clientCardID }
            })

            if (data.ok) {
                setClientCard(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrontg')

        }
    }

    useEffect(() => {

        retrieveBooking()

    }, [bookingID])

    useEffect(() => {

        if (bookingData?.clientCardID) {
            retrieveClientCard()
        }

    }, [bookingData?.clientCardID])

    const t = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen flex bg-opacity-50 bg-gray-600'>
            <div className='w-full h-full cursor-pointer' title='Close' onClick={closeViewBooking}></div>
            <div className='bg-white p-10 shadow-lg flex items-start gap-10 overflow-y-auto w-full h-full relative'>
                <FontAwesomeIcon onClick={closeViewBooking} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex w-1/2 flex-col gap-3.5 p-5 border'>
                    <div className='flex items-center gap-2'><span className='font-medium'>Date:</span>{bookingData?.schedule[0].date} ({bookingData?.schedule[0].time})</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Client:</span>{bookingData?.client.name}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Card:</span>{clientCard?.name ? clientCard?.name : <span className='w-28 h-5 rounded-3xl bg-slate-200 animate-pulse'></span>}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Meeting Info:</span>{bookingData?.meeting_info?.service} <span title='Click to Copy' className='cursor-pointer hover:text-blue-600' onClick={() => {
                        const meetingCode = bookingData?.meeting_info?.meeting_code
                        if (meetingCode) {
                            navigator.clipboard.writeText(meetingCode)
                            alert(`Copied ${meetingCode}`)
                        }
                    }} >{bookingData?.meeting_info?.meeting_code}</span></div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Note:</span>{bookingData?.note ? bookingData?.note : 'No Data'}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Status:</span>{bookingData?.status}</div>
                    <div className='flex items-center w-full gap-5'>
                        <button onClick={closeViewBooking} className='py-2 rounded-md border w-full'>Close</button>
                        <button onClick={(e: any) => cancelBooking(e)} disabled={isLoading} className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Cancel Booking'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBokingModal