import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const MarkBookingAsCompleted = () => {

    const [open, setOpen] = useState(false)
    const { selectedBookings, markBookingAsCompleted } = useAdminBookingStore()

    if (selectedBookings.length < 1) setOpen(false)

    const t = useTranslations()
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>{t('booking.completed.button')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('booking.completed.confirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    {selectedBookings.length > 0 ?
                        selectedBookings.map(booking => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                                <div>{t("info.id")}: <span className='font-normal text-muted-foreground'>{booking.id}</span></div>
                                <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{booking.name}</span></div>
                            </div>
                        ))
                        : null
                    }
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                    <form onSubmit={(e) => markBookingAsCompleted(e, setOpen)}>
                        <SubmitButton msg={t('operation.confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >

    )
}

export default MarkBookingAsCompleted