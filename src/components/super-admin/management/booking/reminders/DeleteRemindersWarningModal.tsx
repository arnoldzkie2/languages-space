/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Err from '@/components/global/Err';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/global/SubmitButton';

interface Props {

}

const DeleteRemindersWarningModal: React.FC<Props> = () => {

    const { setIsLoading, setErr } = useGlobalStore()

    const { remindersData, selectedReminders, closeDeleteRemindersWarningModal, getReminders, setSelectedReminders } = useAdminBookingStore()

    const deleteReminders = async (e: React.MouseEvent) => {

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
                toast("Success! reminders deleted.")
                setIsLoading(false)
                closeDeleteRemindersWarningModal()
                getReminders()
                setSelectedReminders([])
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const t = useTranslations('global')
    const tt = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 backdrop-blur text-muted-foreground'>
            <Card>
                <CardHeader>
                    <CardTitle>{tt("booking.delete")}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-3 overflow-y-auto h-3/4 w-full'>
                        {selectedReminders.length > 0 ?
                            selectedReminders.map(booking => (
                                <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                                    <div>BOOKING ID: <span className='font-normal text-muted-foreground'>{booking.id}</span></div>
                                    <div>NAME: <span className='font-normal text-muted-foreground'>{booking.name}</span></div>
                                </div>
                            ))
                            :
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={remindersData?.id}>
                                <div>BOOKING ID: <span className='font-normal text-muted-foreground'>{remindersData?.id}</span></div>
                                <div>NAME: <span className='font-normal text-muted-foreground'>{remindersData?.name}</span></div>
                            </div>
                        }
                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button onClick={closeDeleteRemindersWarningModal} variant={'ghost'}>{t('cancel')}</Button>
                            <SubmitButton variant={'destructive'} onClick={deleteReminders} msg={t('confirm')} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteRemindersWarningModal;
