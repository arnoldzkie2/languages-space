import ViewClientCommentAlert from '@/components/client/ViewClientCommentAlert'
import Err from '@/components/global/Err'
import ViewSupplierCommentAlert from '@/components/supplier/ViewSupplierBookingComment'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import { COMPLETED } from '@/utils/constants'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const ViewCommentsAlert = ({ booking }: { booking: BookingProps }) => {

    const [open, setOpen] = useState(false)

    const t = useTranslations()

    if (booking.status !== COMPLETED) return null

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {t('booking.comments.h1')}
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("booking.comments.view")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex items-center h-7 gap-5'>
                    <ViewClientCommentAlert booking={booking} />
                    <Separator orientation='vertical' />
                    <ViewSupplierCommentAlert booking={booking} />
                </div>
                <AlertDialogFooter>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >)
}

export default ViewCommentsAlert