import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import { Booking } from '@/lib/types/super-admin/bookingType'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    reminder: Booking
}

const DeleteSingleRemindersAlert = ({ reminder }: Props) => {

    const [open, setOpen] = useState(false)
    const { getReminders } = useAdminBookingStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSingleReminder = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const { data } = await axios.delete('/api/booking/reminders', { params: { remindersID: reminder.id } })

            if (data.ok) {
                getReminders()
                setIsLoading(false)
                toast("Success! reminder deleted.")
                setOpen(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {tt('delete')}
                    <FontAwesomeIcon icon={faTrashCan} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("booking.delete")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>ID: <span className='font-normal text-muted-foreground'>{reminder.id}</span></div>
                        <div>{tt('name')}: <span className='font-normal text-muted-foreground'>{reminder.name}</span></div>
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                    <form onSubmit={deleteSingleReminder}>
                        <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default DeleteSingleRemindersAlert