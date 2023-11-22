'use client'

import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React from 'react'

const ConfirmBookingModal = () => {

    const { setIsLoading, isLoading } = useAdminGlobalStore()
    const { getReminders, closeConfirmBookingModal, remindersData } = useAdminBookingStore()

    const bookNow = async (e: any) => {

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/reminders/confirm', { remindersID: remindersData?.id })

            if (data.ok) {
                setIsLoading(false)
                closeConfirmBookingModal()
                getReminders()
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col gap-3 overflow-y-auto h-3/4 w-1/4'>
                <h1 className='text-xl pb-4 text-center'>{t('booking.reminders.confirmation')}</h1>

                <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={remindersData?.id}>
                    <div className='flex items-center justify-between'>NAME: <span className='font-normal text-gray-700'>{remindersData?.name}</span></div>
                    <div className='flex items-center justify-between'>CLIENT: <span className='font-normal text-gray-700'>{remindersData?.client.name}</span></div>
                    <div className='flex items-center justify-between'>CARD: <span className='font-normal text-gray-700'>{remindersData?.card_name}</span></div>
                    <div className='flex items-center justify-between'>SUPPLIER: <span className='font-normal text-gray-700'>{remindersData?.supplier.name}</span></div>
                    <div className='flex items-center justify-between'>SCHEDULE: <span className='font-normal text-gray-700'>{remindersData?.schedule[0].date} ({remindersData?.schedule[0].time})</span></div>
                    <div className='flex items-center justify-between'>PRICE: <span className='font-normal text-gray-700'>¥{remindersData?.price}</span></div>
                </div>
                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeConfirmBookingModal()}>{tt('cancel')}</button>
                    <button disabled={isLoading}
                        className={`text-sm text-white rounded-lg flex items-center justify-center px-3 py-2 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                        onClick={(e: any) => bookNow(e)}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('confirm')}</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBookingModal