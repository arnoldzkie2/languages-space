/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props {

}

const DeleteBookingWarningModal: React.FC<Props> = () => {

    const { isLoading, setIsLoading } = useAdminGlobalStore()
    const { bookingData, selectedBookings, closeDeleteBookingWarningModal, getBookings, setSelectedBookings } = useAdminBookingStore()

    const deleteBooking = async () => {

        try {

            setIsLoading(true)

            if (selectedBookings.length > 0) {
                const newsIds = selectedBookings.map((bookings) => bookings.id);
                const queryString = newsIds.map((id) => `bookingID=${encodeURIComponent(id)}`).join('&');
                var { data } = await axios.delete(`/api/booking?${queryString}`, {
                    params: {
                        type: 'delete'
                    }
                });

            } else {
                var { data } = await axios.delete(`/api/booking`, {
                    params: { bookingID: bookingData?.id, type: 'delete' }
                })

            }

            if (data.ok) {

                setIsLoading(false)
                closeDeleteBookingWarningModal()
                getBookings()
                setSelectedBookings([])

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
                {selectedBookings.length > 0 ?
                    selectedBookings.map(booking => (
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                            <div>BOOKING ID: <span className='font-normal text-gray-700'>{booking.id}</span></div>
                            <div>NAME: <span className='font-normal text-gray-700'>{booking.name}</span></div>
                        </div>
                    ))
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={bookingData?.id}>
                        <div>BOOKING ID: <span className='font-normal text-gray-700'>{bookingData?.id}</span></div>
                        <div>NAME: <span className='font-normal text-gray-700'>{bookingData?.name}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteBookingWarningModal()}>{t('cancel')}</button>
                    <button disabled={isLoading}
                        className={`text-sm text-white rounded-lg flex items-center justify-center px-3 py-2 ${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'}`}
                        onClick={() => deleteBooking()}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animte-spin' /> : t('confirm')}</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBookingWarningModal;
