import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import Err from '../global/Err'
import SubmitButton from '../global/SubmitButton'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import useGlobalStore from '@/lib/state/globalStore'
import { toast } from 'sonner'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
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

const UpdateSupplierCommentAlert = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)
    const { setIsLoading, setErr } = useGlobalStore()
    const { getBookings } = useSupplierBookingStore()

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

    const retrieveComment = async () => {
        try {
            const { data } = await axios.get('/api/booking/comments/supplier', {
                params: { bookingID: booking.id }
            })

            if (data.ok) setFormData(data.data)

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const updateSupplierComment = async (e: React.FormEvent) => {

        e.preventDefault()

        const { rate, message, client_level, sentences, homework, book_name, book_page, vocabulary } = formData

        if (!rate) return setErr("Rate is required")
        if (!message) return setErr("Message is required")
        if (!client_level) return setErr("Client Level is required")
        if (!sentences) return setErr("Sentences is required")
        if (!book_name) return setErr("Book name is required")
        if (!book_page) return setErr("Book Page is required")
        if (vocabulary.length === 0) return setErr("Vocabulary is required")

        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/booking/comments/supplier', {
                rate,
                message,
                bookingID: booking.id,
                homework,
                client_level,
                sentences,
                book_name,
                book_page,
                vocabulary
            })

            if (data.ok) {
                getBookings()
                setIsLoading(false)
                toast.success("Success! comments updated.")
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
        if (open) {
            retrieveComment()
            retrieveTemplate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const t = useTranslations()
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className='w-full'>
                <Button className='w-full'>{t('user.you')}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('booking.comments.create')}</AlertDialogTitle>
                    <AlertDialogDescription><Err /></AlertDialogDescription>
                </AlertDialogHeader>
                <form className='w-full flex flex-col gap-5 text-muted-foreground overflow-y-auto px-2 max-h-[600px]' onSubmit={updateSupplierComment}>
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
                                    onClick={() => setFormData(prev => ({ ...prev, rate }))}
                                >
                                    <FontAwesomeIcon icon={faStar} width={16} height={16} className={`${formData.rate >= rate ? 'text-yellow-500' : 'text-muted-foreground'} cursor-pointer`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <Label className='w-full'>{t("booking.comments.level.h1")}</Label>

                        <Select onValueChange={(client_level) => setFormData(prev => ({ ...prev, client_level }))} value={formData.client_level}>
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
                                <Input value={formData.book_name} name='book_name' onChange={handleChange} />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <Label>{t("booking.comments.book.page")}</Label>
                                <Input value={formData.book_page} name='book_page' onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label>{t('booking.comments.vocabulary')}</Label>
                        <Input value={formData.vocabulary} name='vocabulary' onChange={handleChange} />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label>{t('booking.comments.sentences')}</Label>
                        <Textarea className='text-muted-foreground' value={formData.sentences} name='sentences' onChange={handleChange} />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <Label>{t('booking.comments.homework')} {t("global.optional")}</Label>
                        <Textarea className='text-muted-foreground' value={formData.homework} name='homework' onChange={handleChange} />
                    </div>
                    <div className='flex flex-col gap-1.5'>
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
    setFormData: React.Dispatch<React.SetStateAction<SupplierBookingCommentFormData>>
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
                <div className='flex flex-col gap-5 max-h-[500px] overflow-y-auto'>
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

export default UpdateSupplierCommentAlert