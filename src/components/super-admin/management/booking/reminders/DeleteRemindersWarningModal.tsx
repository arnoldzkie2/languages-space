/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useGlobalStore from '@/lib/state/globalStore';

interface Props {

}

const DeleteRemindersWarningModal: React.FC<Props> = () => {

    const { isLoading, setIsLoading } = useGlobalStore()

    const { remindersData, selectedReminders, closeDeleteRemindersWarningModal, getReminders, setSelectedReminders } = useAdminBookingStore()

    const deleteReminders = async (e: any) => {

        e.preventDefault()

        try {

            setIsLoading(true)

            if (selectedReminders.length > 0) {

                const newsIds = selectedReminders.map((bookings) => bookings.id);
                const queryString = newsIds.map((id) => `remindersID=${encodeURIComponent(id)}`).join('&');
                var { data } = await axios.delete(`/api/booking/reminders?${queryString}`);

            } else {
                
                var { data } = await axios.delete(`/api/booking/reminders`, {
                    params: { remindersID: remindersData?.id, type: 'delete' }
                })

            }

            if (data.ok) {

                setIsLoading(false)
                closeDeleteRemindersWarningModal()
                getReminders()
                setSelectedReminders([])

            }

        } catch (error) {
            setIsLoading(false)
            alert('Something went wrong')
            console.log(error);
        }
    }

    const t = useTranslations('global')
    const tt = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col gap-3 overflow-y-auto h-3/4 w-1/2'>
                <h1 className='text-xl pb-4 text-center'>{tt('booking.delete')}</h1>
                {selectedReminders.length > 0 ?
                    selectedReminders.map(booking => (
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                            <div>BOOKING ID: <span className='font-normal text-gray-700'>{booking.id}</span></div>
                            <div>NAME: <span className='font-normal text-gray-700'>{booking.name}</span></div>
                        </div>
                    ))
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={remindersData?.id}>
                        <div>BOOKING ID: <span className='font-normal text-gray-700'>{remindersData?.id}</span></div>
                        <div>NAME: <span className='font-normal text-gray-700'>{remindersData?.name}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteRemindersWarningModal()}>{t('cancel')}</button>
                    <button disabled={isLoading}
                        className={`text-sm text-white rounded-lg flex items-center justify-center px-3 py-2 ${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'}`}
                        onClick={(e: any) => deleteReminders(e)}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animte-spin' /> : t('confirm')}</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRemindersWarningModal;
