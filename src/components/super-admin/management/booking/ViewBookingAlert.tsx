import Err from '@/components/global/Err'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

interface Props {
    booking: BookingProps
}

const ViewBookingAlert = ({ booking }: Props) => {

    const [open, setOpen] = useState(false)

    const t = useTranslations()

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {t('operation.view')}
                    <FontAwesomeIcon icon={faEye} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("booking.view")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='font-bold text-sm flex flex-col gap-2'>
                        <div>{t('info.id')}: <span className='font-normal text-muted-foreground'>{booking.id}</span></div>
                        <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{booking.name}</span></div>
                        <div>{t('user.supplier')}: <span className='font-normal text-muted-foreground'>{booking.supplier.name}</span></div>
                        <div>{t('user.client')}: <span className='font-normal text-muted-foreground'>{booking.client.username}</span></div>
                        <div>{t('side_nav.schedule')}: <span className='font-normal text-muted-foreground'>{booking.schedule.date} ({booking.schedule.time})</span></div>
                        <div>{t('side_nav.card')}: <span className='font-normal text-muted-foreground'>{booking.card_name}</span></div>
                        <div className='flex items-center gap-2'>{t('info.quantity')}:
                            <span className='font-normal text-muted-foreground'>{t('user.client')} {Number(booking.client_quantity)}</span>
                            <Separator orientation='vertical' />
                            <span className='font-normal text-muted-foreground'>{t('user.supplier')} {Number(booking.supplier_quantity)}</span>
                        </div>
                        <div>{t('info.operator.h1')}: <span className='font-normal text-muted-foreground'>{booking.operator}</span></div>
                        <div>{t('status.h1')}: <span className='font-normal text-muted-foreground'>{booking.status}</span></div>
                        <div>{t('info.date.h1')}: <span className='font-normal text-muted-foreground'>{new Date(booking.created_at).toLocaleString()}</span></div>
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default ViewBookingAlert