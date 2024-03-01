import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import Err from '../global/Err'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useGlobalStore from '@/lib/state/globalStore'

const ViewClientCommentAlert = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)
    const { setErr } = useGlobalStore()

    const [formData, setFormData] = useState({
        rate: 0,
        message: ''
    })

    const retrieveClientComment = async () => {
        try {

            const { data } = await axios.get('/api/booking/comments/client', {
                params: {
                    bookingID: booking.id
                }
            })
            if (data.ok) setFormData(data.data)

        } catch (error: any) {
            if (error.response.data.msg === 'no_comment') {
                return setErr("Client did not rate this booking yet.")
            }
            console.log(error);
            alert("Something went wrong")
        }
    }

    useEffect(() => {
        if (open && booking.client_comment) retrieveClientComment()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const t = useTranslations()

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className='w-full'>
                <Button className='w-full' variant={booking.client_comment ? 'default' : 'secondary'}>{t('user.client')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('booking.comments.view')}</AlertDialogTitle>
                    <AlertDialogDescription><Err /></AlertDialogDescription>
                </AlertDialogHeader>
                {booking.client_comment ? <form className='w-full flex flex-col gap-10'>
                    <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center gap-2'>
                            <Avatar>
                                <AvatarImage>{booking.client.profile_url}</AvatarImage>
                                <AvatarFallback>{booking.client.username.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <Label>{booking.client.username}</Label>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Label className='mr-2 text-muted-foreground'>{t('info.rate')}: </Label>
                            {[1, 2, 3, 4, 5].map(rate => (
                                <div key={rate}
                                >
                                    <FontAwesomeIcon icon={faHeart} width={16} height={16} className={`${formData.rate >= rate ? 'text-red-500' : 'text-muted-foreground'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>{t('info.message')}: </Label>
                        <Textarea className='max-h-[400px] min-h-[300px] text-muted-foreground' value={formData.message} readOnly />
                    </div>
                </form> : <div className='text-red-500 p-3 border'>{t('booking.comments.no_rate.client')}</div>}
                <AlertDialogFooter className='w-full flex items-center gap-10'>
                    <Button type='button' variant={'ghost'} className='w-full' onClick={() => setOpen(false)}>{t("operation.close")}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default ViewClientCommentAlert