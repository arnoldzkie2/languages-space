import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import Err from '../global/Err'
import SubmitButton from '../global/SubmitButton'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useGlobalStore from '@/lib/state/globalStore'
import { toast } from 'sonner'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'

const CreateClientCommentAlert = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)
    const { setIsLoading, setErr } = useGlobalStore()
    const { getBookings } = useClientBookingStore()

    const [formData, setFormData] = useState({
        rate: 0,
        message: ''
    })
    const [templates, setTemplates] = useState<string[] | null>(null)

    const retrieveTemplate = async () => {
        try {

            const { data } = await axios.get('/api/booking/comments/template', {
                params: {
                    bookingID: booking.id
                }
            })

            if (data.ok) setTemplates(data.data)

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    const createClientComment = async (e: React.FormEvent) => {

        e.preventDefault()

        const { rate, message } = formData
        if (!rate) return setErr("Rate is required")
        if (!message) return setErr("Message is required")

        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/booking/comments/client', {
                rate, message, bookingID: booking.id
            })

            if (data.ok) {
                getBookings()
                setIsLoading(false)
                toast("Success! comments created")
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


    useEffect(() => {
        if (open) retrieveTemplate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const t = useTranslations()
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className='w-full'>
                <Button className='w-full' variant={'secondary'}>{t('user.you')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('booking.comments.create')}</AlertDialogTitle>
                    <AlertDialogDescription><Err /></AlertDialogDescription>
                </AlertDialogHeader>
                <form className='w-full flex flex-col gap-10' onSubmit={createClientComment}>
                    <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center gap-2'>
                            <Avatar>
                                <AvatarImage>{booking.supplier.profile_url}</AvatarImage>
                                <AvatarFallback>{booking.supplier.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <Label>{booking.supplier.name}</Label>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Label className='mr-2 text-muted-foreground'>{t('info.rate')}: </Label>
                            {[1, 2, 3, 4, 5].map(rate => (
                                <div key={rate}
                                    onClick={() => setFormData(prev => ({ ...prev, rate }))}
                                >
                                    <FontAwesomeIcon icon={faHeart} width={16} height={16} className={`${formData.rate >= rate ? 'text-red-500' : 'text-muted-foreground'} cursor-pointer`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center w-full justify-between'>
                            <Label className='mr-2'>{t('info.message')}: </Label>
                            <RenderTemplates templates={templates} setFormData={setFormData} />
                        </div>
                        <Textarea className='max-h-[400px] text-muted-foreground' value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} />
                    </div>
                    <AlertDialogFooter className='w-full flex items-center gap-10'>
                        <Button type='button' variant={'ghost'} className='w-full' onClick={() => setOpen(false)}>{t("operation.close")}</Button>
                        <SubmitButton style='w-full' msg={t('operation.submit')} />
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const RenderTemplates = ({ templates, setFormData }: {
    templates: string[] | null,
    setFormData: React.Dispatch<React.SetStateAction<{
        rate: number;
        message: string;
    }>>
}) => {

    const [open, setOpen] = useState(false)

    const t = useTranslations()

    if (!templates) return (
        <div></div>
    )

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button type='button' variant={'ghost'}>{t('booking.comments.template.h1')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("booking.comments.template.h1")}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className='flex flex-col gap-5'>
                    {templates.map((message) => (
                        <div
                            className='border p-3 rounded-md hover:bg-muted cursor-pointer'
                            onClick={() => {
                                setFormData(prev => ({ ...prev, message }))
                                setOpen(false)
                            }}
                            title={t('operation.select')}
                            key={message}>{message}</div>
                    ))}
                </div>
                <AlertDialogFooter>
                    <Button type='button' variant={'ghost'} className='w-full' onClick={() => setOpen(false)}>{t('operation.close')}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>
    )
}

export default CreateClientCommentAlert