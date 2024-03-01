import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import Err from '../global/Err'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useGlobalStore from '@/lib/state/globalStore'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'

interface SupplierBookingCommentFormData {
    rate: number
    client_level: string
    book_page: string
    book_name: string
    message: string
    sentences: string
    vocabulary: string[]
    homework: string
}

const ViewSupplierCommentAlert = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)
    const { setErr } = useGlobalStore()

    const [formData, setFormData] = useState<SupplierBookingCommentFormData>({
        rate: 0,
        client_level: '',
        sentences: '',
        homework: '',
        book_name: '',
        book_page: '',
        vocabulary: [],
        message: ''
    })

    const retrieveSupplierComment = async () => {

        try {
            const { data } = await axios.get('/api/booking/comments/supplier', {
                params: { bookingID: booking.id }
            })

            if (data.ok) setFormData(data.data)

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }


    useEffect(() => {
        if (open && booking.supplier_comment) retrieveSupplierComment()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const t = useTranslations()
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className='w-full'>
                <Button className='w-full' variant={booking.supplier_comment ? 'default' : 'secondary'} >{t('user.supplier')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('booking.comments.view')}</AlertDialogTitle>
                    <AlertDialogDescription><Err /></AlertDialogDescription>
                </AlertDialogHeader>
                {booking.supplier_comment ? <form className='w-full flex flex-col gap-5 text-muted-foreground overflow-y-auto px-2 max-h-[600px] pb-5'>
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
                                >
                                    <FontAwesomeIcon icon={faStar} width={16} height={16} className={`${formData.rate >= rate ? 'text-yellow-500' : 'text-muted-foreground'} cursor-pointer`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <Label className='w-full'>{t("booking.comments.level.h1")}</Label>

                        <Select value={formData.client_level}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('operation.select')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('operation.select')}</SelectLabel>
                                    <SelectItem value="pre_beginner">{t('booking.comments.level.pre_beginner')}</SelectItem>
                                    <SelectItem value="beginner">{t('booking.comments.level.beginner')}</SelectItem>
                                    <SelectItem value="high_beginner">{t('booking.comments.level.high_beginner')}</SelectItem>
                                    <SelectItem value="pre_intermediate">{t('booking.comments.level.pre_intermediate')}</SelectItem>
                                    <SelectItem value="upper_intermediate">{t('booking.comments.level.upper_intermediate')}</SelectItem>
                                    <SelectItem value="advanced">{t('booking.comments.level.advanced')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label className='border-b pb-2 mb-1'>{t('booking.comments.book.h1')}</Label>
                        <div className='flex items-center gap-5'>
                            <div className='flex flex-col gap-1.5'>
                                <Label>{t("booking.comments.book.name")}</Label>
                                <Input value={formData.book_name} name='book_name' readOnly />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <Label>{t("booking.comments.book.page")}</Label>
                                <Input value={formData.book_page} name='book_page' readOnly />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label>{t('booking.comments.vocabulary')}</Label>
                        <Input value={formData.vocabulary} name='vocabulary' readOnly />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label>{t('booking.comments.sentences')}</Label>
                        <Textarea className='text-muted-foreground' value={formData.sentences} name='sentences' readOnly />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label>{t('booking.comments.homework')} {t("global.optional")}</Label>
                        <Textarea className='text-muted-foreground' value={formData.homework} name='homework' readOnly />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <div className='flex items-center w-full justify-between'>
                            <Label className='mr-2'>{t('info.message')}: </Label>
                        </div>
                        <Textarea className='max-h-[400px] min-h-[300px] text-muted-foreground' value={formData.message} readOnly />
                    </div>
                </form> :
                    <div className='text-red-600 border p-3'>
                        {t("booking.comments.no_rate.supplier")}
                    </div>
                }
                <AlertDialogFooter className='w-full flex items-center gap-10'>
                    <Button type='button' variant={'ghost'} className='w-full' onClick={() => setOpen(false)}>{t("operation.close")}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ViewSupplierCommentAlert