import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteSelectedBookings = () => {

    const [open, setOpen] = useState(false)
    const { selectedBookings, getBookings, setSelectedBookings } = useAdminBookingStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedBookings = async (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const bookingIds = selectedBookings.map((bookings) => bookings.id);
            const queryString = bookingIds.map((id) => `bookingID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/booking?${queryString}`, {
                params: { type: 'delete' }
            })
            if (data.ok) {
                getBookings()
                toast("Success! bookings deleted.")
                setSelectedBookings([])
                setIsLoading(false)
                setOpen(false)
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

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")

    if (selectedBookings.length < 1) return null
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={'destructive'}>{tt('delete-all')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('booking.delete')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                    {selectedBookings.map(booking => (
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={booking.id}>
                            <div>ID: <span className='font-normal text-muted-foreground'>{booking.id}</span></div>
                            <div>{tt('name')}: <span className='font-normal text-muted-foreground'>{booking.name}</span></div>
                        </div>
                    ))}
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                    <form onSubmit={(e) => deleteSelectedBookings(e, setOpen)}>
                        <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >

    )
}

export default DeleteSelectedBookings