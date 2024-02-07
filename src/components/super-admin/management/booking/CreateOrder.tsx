import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const CreateOrder = () => {

    const [open, setOpen] = useState(false)
    const { selectedBookings, createBookingOrder } = useAdminBookingStore()

    if (selectedBookings.length < 1) setOpen(false)

    const oldestDate = selectedBookings[0].schedule.date;
    const newestDate = selectedBookings[selectedBookings.length - 1].schedule.date;
    const totalPrice: number = selectedBookings.reduce((sum, booking) => sum + Number(booking.price), 0);

    const tt = useTranslations("global")
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={'link'}>Create Order</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to create this order?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-1'>
                        <Label>{tt('name')}</Label>
                        <Input value={`${selectedBookings[0].client.username}, ${selectedBookings[0].name} from ${oldestDate} to ${newestDate}`} readOnly />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label>{tt('card')}</Label>
                        <Input value={selectedBookings[0].card_name} readOnly />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label>{tt('price')}</Label>
                        <Input value={totalPrice} readOnly />
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                    <form onSubmit={(e) => createBookingOrder(e, setOpen)}>
                        <SubmitButton msg={tt('confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default CreateOrder