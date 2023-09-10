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

const ViewScheduleModal = () => {

    const { closeViewSchedule, getSchedule, currentDate, scheduleData } = useAdminScheduleStore()

    const [clientCard, setClientCard] = useState<ClientCard>()

    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const { supplierSelectedID } = useAdminSupplierStore()

    const deleteSchedule = async (e: any) => {

        e.preventDefault()

        try {

            setIsLoading(true)

            const { data } = await axios.delete('/api/booking', {
                params: {
                    scheduleID: scheduleData.id,
                    supplierID: scheduleData.supplier_id,
                    clientID: scheduleData.client_id
                }
            })

            if (data.ok) {
                setIsLoading(false)
                closeViewSchedule()
                getSchedule(supplierSelectedID, currentDate.fromDate, currentDate.toDate)
            }

        } catch (error) {

            setIsLoading(false)
            console.log(error)
            alert('Something went wrong')

        }
    }

    useEffect(() => {

        const fetchCard = async () => {

            try {

                const { data } = await axios.get(`/api/client/card-list`, {
                    params: {
                        clientCardID: scheduleData.client_card_id
                    }
                })

                if (data.ok) setClientCard(data.data)

            } catch (error) {

                console.log(error);

                alert('Something went wrong')

            }
        }

        fetchCard()

    }, [])

    const t = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-end bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 shadow-lg flex items-start gap-10 overflow-y-auto w-1/2 h-full relative'>
                <FontAwesomeIcon onClick={closeViewSchedule} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex w-1/2 flex-col gap-3.5 p-5 border'>
                    <div className='flex items-center gap-2'><span className='font-medium'>Date:</span>{scheduleData.date} ({scheduleData.time})</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Client:</span>{scheduleData.client_name}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Card:</span>{clientCard?.name ? clientCard?.name : <span className='w-28 h-5 rounded-3xl bg-slate-200 animate-pulse'></span>}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Meeting Info:</span>{scheduleData.meeting_info?.service} <span onClick={() => {

                        const meetingCode = scheduleData.meeting_info?.meeting_code

                        if (meetingCode) {

                            navigator.clipboard.writeText(meetingCode)

                            alert(`Copied ${meetingCode}`)

                        }

                    }} >{scheduleData.meeting_info?.meeting_code}</span></div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Note:</span>{scheduleData?.note ? scheduleData.note : 'No Data'}</div>
                    <div className='flex items-center gap-2'><span className='font-medium'>Completed:</span> <span className={`h-6 w-6 rounded-full ${scheduleData.completed ? 'bg-green-500' : 'bg-red-500'}`}></span></div>
                    <div className='flex items-center w-full gap-5'>
                        <button onClick={closeViewSchedule} className='py-2 rounded-md border w-full'>Close</button>
                        <button onClick={(e: any) => deleteSchedule(e)} disabled={isLoading} className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Cancel Booking'}</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ViewScheduleModal