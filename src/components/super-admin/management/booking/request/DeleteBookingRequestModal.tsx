/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useGlobalStore from '@/lib/state/globalStore';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Err from '@/components/global/Err';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/global/SubmitButton';

interface Props {

}

const DeleteBookingRequestModal: React.FC<Props> = () => {

    const { setIsLoading } = useGlobalStore()
    const { bookingRequestData, selectedBookingRequests, closeDeleteBookingRequestWarningModal, getBookingRequests, setSelectedBookingRequests } = useAdminBookingStore()

    const deleteBooking = async (e: React.MouseEvent) => {

        try {
            e.preventDefault()
            setIsLoading(true)

            if (selectedBookingRequests.length > 0) {
                const newsIds = selectedBookingRequests.map((bookings) => bookings.id);
                const queryString = newsIds.map((id) => `boookingRequestID=${encodeURIComponent(id)}`).join('&');
                var { data } = await axios.delete(`/api/booking/request?${queryString}`, {
                });

            } else {
                var { data } = await axios.delete(`/api/booking/request`, {
                    params: { boookingRequestID: bookingRequestData?.id }
                })
            }

            if (data.ok) {
                toast("Success! Booking deleted.")
                setIsLoading(false)
                closeDeleteBookingRequestWarningModal()
                getBookingRequests()
                setSelectedBookingRequests([])
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
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 backdrop-blur'>
            <Card className='h-3/4 overflow-y-auto'>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-3 w-full'>
                        <h1 className='text-xl pb-4 text-center'>{tt('booking.delete')}</h1>
                        {selectedBookingRequests.length > 0 ?
                            selectedBookingRequests.map(booking => (
                                <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                                    <div>BOOKING ID: <span className='font-normal text-muted-foreground'>{booking.id}</span></div>
                                    <div>NAME: <span className='font-normal text-muted-foreground'>{booking.name}</span></div>
                                </div>
                            ))
                            :
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={bookingRequestData?.id}>
                                <div>BOOKING ID: <span className='font-normal text-muted-foreground'>{bookingRequestData?.id}</span></div>
                                <div>NAME: <span className='font-normal text-muted-foreground'>{bookingRequestData?.name}</span></div>
                            </div>
                        }
                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button variant={'ghost'} onClick={closeDeleteBookingRequestWarningModal}>{t('close')}</Button>
                            <SubmitButton onClick={deleteBooking} variant={'destructive'} msg={t('confirm')} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteBookingRequestModal;
