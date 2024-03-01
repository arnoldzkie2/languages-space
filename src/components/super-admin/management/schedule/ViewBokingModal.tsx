'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import axios from 'axios'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import useGlobalStore from '@/lib/state/globalStore'
import { toast } from 'sonner'
import { BookingProps } from '@/lib/types/super-admin/bookingType'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Err from '@/components/global/Err'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const ViewBokingModal = () => {

    const { closeViewBooking, getSchedule, currentDate, bookingID } = useAdminScheduleStore()
    const { isLoading, setIsLoading, copy } = useGlobalStore()
    const { bookingFormData } = useAdminBookingStore()

    const [bookingData, setBookingData] = useState<BookingProps | null>(null)

    const [meetingInfo, setMeetingInfo] = useState<any | null>(null)

    const cancelBooking = async (e: React.MouseEvent) => {

        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/booking', {
                params: {
                    bookingID,
                    type: 'cancel'
                }
            })

            if (data.ok) {
                setIsLoading(false)
                closeViewBooking()
                toast("Success! booking canceled.")
                getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error)
            alert('Something went wrong')
        }
    }

    const retrieveBooking = async () => {
        try {

            const { data } = await axios.get('/api/booking', {
                params: { bookingID }
            })

            if (data.ok) {
                setMeetingInfo(data.data.meeting_info)
                setBookingData(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    const deleteSchedule = async (e: React.MouseEvent, scheduleID: string) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const { data } = await axios.delete('/api/schedule', {
                params: { scheduleID }
            })

            if (data.ok) {
                setIsLoading(false)
                getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
                alert('Success')
                closeViewBooking()
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }

            alert('Something went wrong')

        }

    }

    useEffect(() => {
        if (bookingID) retrieveBooking()
    }, [bookingID])

    const t = useTranslations()

    if (!bookingData) return null

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen flex items-center justify-center bg-opacity-50 backdrop-blur'>
            <div className='overflow-y-auto relative'>
                <FontAwesomeIcon onClick={closeViewBooking} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <Card>
                    <CardHeader>
                        <CardTitle>{t('booking.view')}</CardTitle>
                        <CardDescription><Err /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex w-full flex-col gap-3.5'>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('side_nav.schedule')}</Label>
                                <Input readOnly value={`${bookingData.schedule.date} at ${bookingData.schedule.time}`} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('side_nav.client')}</Label>
                                <Input readOnly value={bookingData.client.username} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('side_nav.card')}</Label>
                                <Input readOnly value={bookingData.card_name} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('meeting.h1')}</Label>
                                <Input className='cursor-pointer' title='Click to copy'
                                    readOnly value={`${meetingInfo.service} - ${meetingInfo.meeting_code}`}
                                    onClick={() => copy(meetingInfo.meeting_code)} />
                            </div>
                            <div className='w-full border-b pb-1 text-center'>{t("info.quantity")}</div>
                            <div className='flex w-full items-center gap-5'>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="client_quantity">{t("side_nav.client")}</Label>
                                    <Input type="number" id="client_quantity" name='client_quantity'
                                        value={Number(bookingData.client_quantity)}
                                        readOnly />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="supplier_quantity">{t("side_nav.supplier")}</Label>
                                    <Input type="number" id="supplier_quantity" name='supplier_quantity'
                                        value={Number(bookingData.supplier_quantity)}
                                        readOnly />
                                </div>

                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('card.price')}</Label>
                                <Input readOnly value={Number(bookingData.price)} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('info.note')}</Label>
                                <Textarea readOnly value={bookingData.note || ''} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>{t('status.h1')}</Label>
                                <Input readOnly value={bookingData.status} />
                            </div>
                            <div className='flex w-full gap-5'>
                                <Button variant={'ghost'} onClick={closeViewBooking} className='w-full'>{t('operation.close')}</Button>
                                <Button
                                    variant={'destructive'}
                                    onClick={cancelBooking}
                                >{t("operation.cancel")}</Button>
                                <Button
                                    variant={'destructive'}
                                    onClick={(e) => deleteSchedule(e, bookingData.scheduleID)}
                                >{t("schedule.delete")}</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default ViewBokingModal