/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Err from '@/components/global/Err';
import { Button } from '@/components/ui/button';

interface Props {

}

const DeleteBookingWarningModal: React.FC<Props> = () => {

    const { isLoading } = useGlobalStore()
    const { bookingData, selectedBookings, closeDeleteBookingWarningModal } = useAdminBookingStore()

    const t = useTranslations('global')
    const tt = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center backdrop-blur-sm'>
            <Card className='flex flex-col gap-3 overflow-y-auto h-3/4 w-1/4'>
                <CardHeader>
                    <CardTitle>{tt('booking.delete')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col'>
                    {selectedBookings.length > 0 ?
                        selectedBookings.map(booking => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                                <div>BOOKING ID: <span className='font-normal text-muted-foreground'>{booking.id}</span></div>
                                <div>{t('name')}: <span className='font-normal text-muted-foreground'>{booking.name}</span></div>
                            </div>
                        ))
                        :
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={bookingData?.id}>
                            <div>BOOKING ID: <span className='font-normal text-muted-foreground'>{bookingData?.id}</span></div>
                            <div>{t('name')}: <span className='font-normal text-muted-foreground'>{bookingData?.name}</span></div>
                        </div>
                    }
                    <div className='flex items-center w-full justify-end mt-10 gap-5'>
                        <Button variant={'ghost'} onClick={closeDeleteBookingWarningModal}>{t('cancel')}</Button>
                        {/* <button disabled={isLoading}
                            className={`text-sm text-white rounded-lg flex items-center justify-center px-3 py-2 ${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'}`}
                            onClick={() => deleteBookingFunc()}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('confirm')}</button> */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteBookingWarningModal;
