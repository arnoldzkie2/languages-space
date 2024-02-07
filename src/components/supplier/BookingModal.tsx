/* eslint-disable react-hooks/exhaustive-deps */

'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import useSupplierBookingStore from '@/lib/state/supplier/supplierBookingStore'
import useGlobalStore from '@/lib/state/globalStore'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const BookingModal = () => {

    const { bookingID, closeBooking, getSingleBooking, singleBooking, requestCancelBooking } = useSupplierBookingStore()
    const { copy } = useGlobalStore()

    useEffect(() => {
        getSingleBooking()
    }, [bookingID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='fixed w-screen h-screen top-0 left-0 flex items-center text-muted-foreground justify-center padding z-20 backdrop-blur bg-opacity-25'>

            {singleBooking ?

                <Card className='w-full sm:w-96 break-words'>
                    <CardHeader>
                        <CardTitle className='text-xl'>{tt("booking")}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor="client" className='font-bold text-foreground'>{tt('client')}</Label>
                            <div className='text-sm'>{'->'} {singleBooking?.client.name} ({singleBooking.client.username})</div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor="meeting" className='font-bold text-foreground'>{tt('meeting')}</Label>
                            <div className='text-sm'>{'->'} {singleBooking?.meeting_info.service} <strong className='cursor-pointer text-blue-600' title='Copy' onClick={() => copy(singleBooking?.meeting_info.meeting_code || '')}>{singleBooking?.meeting_info.meeting_code}</strong></div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor="schedule" className='font-bold text-foreground'>{tt('schedule')}</Label>
                            <div className='text-sm'>{'->'} {`${singleBooking?.schedule.date} at ${singleBooking.schedule.time}`}</div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor="status" className='font-bold text-foreground'>{tt('status')}</Label>
                            <div className='text-sm uppercase'>{'->'} {singleBooking?.status}</div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor="course" className='font-bold text-foreground'>{tt('course')}</Label>
                            <div className='text-sm'>{'->'} {singleBooking?.course.name}</div>
                        </div>
                        <div className='flex flex-col gap-2 pb-3 mb-3 border-b'>
                            <Label htmlFor="note" className='font-bold text-foreground'>{tt('note')} {'->'}</Label>
                            <div className='text-sm'>{singleBooking?.note}</div>
                        </div>
                        <Button title='Close' variant={'ghost'} onClick={closeBooking}>{tt('close')}</Button>
                    </CardContent>
                </Card>
                :
                <div className='p-16 bg-card shadow rounded-full flex items-center justify-center'>
                    <FontAwesomeIcon icon={faSpinner} width={30} height={30} className='animate-spin w-[30px] h-[30px]' />
                </div>
            }

        </div >

    )
}

export default BookingModal