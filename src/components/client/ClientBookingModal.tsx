/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import useClientStore from '@/lib/state/client/clientStore'
import { faCalendar, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Err from '../global/Err'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { useTranslations } from 'next-intl'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import useGlobalStore from '@/lib/state/globalStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '@/utils'
import { format, isValid } from 'date-fns'
import { Calendar } from '../ui/calendar'
import SubmitButton from '../global/SubmitButton'

const ClientBookingModal = () => {

    const router = useRouter()

    const { setErr } = useGlobalStore()
    const clearAvailableSuppliers = useClientStore(state => state.clearAvailableSuppliers)
    const { closeBookingModal, createBooking } = useClientBookingStore()
    const { bookingFormData, setBookingFormData } = useAdminBookingStore()
    const { supplierMeetingInfo, getSupplierMeetingInfo, cardCourses } = useAdminSupplierStore()
    const bookingModal = useClientBookingStore(state => state.bookingModal)

    const [selectedDate, setSelectedDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState<{ id: string, time: string }[] | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }

    const getSupplierSchedule = async () => {

        try {

            const { data } = await axios.get('/api/booking/supplier/schedule/date', {
                params: { supplierID: bookingFormData.supplierID, date: selectedDate }
            })

            if (data.ok) setScheduleTime(data.data)

        } catch (error: any) {
            setScheduleTime(null)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    useEffect(() => {

        if (selectedDate && bookingModal && bookingFormData.supplierID) {
            getSupplierSchedule()
        } else {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const defaultDate = `${year}-${month}-${day}`;
            setSelectedDate(defaultDate)
        }

    }, [selectedDate, bookingModal])

    useEffect(() => {

        if (!bookingFormData.clientCardID && bookingModal) {
            closeBookingModal()
            clearAvailableSuppliers()
            alert('Select Card First')
        }

        if (bookingFormData.supplierID && bookingModal) {
            getSupplierMeetingInfo(bookingFormData.supplierID)
        }

    }, [bookingFormData.supplierID, bookingModal])

    const t = useTranslations()

    if (!bookingModal) return null

    return (
        <div className='fixed top-0 right-0 h-screen w-screen backdrop-blur z-20 bg-opacity-40 flex items-center justify-center py-20 px-5'>
            <Card>
                <CardHeader>
                    <CardTitle>{t('booking.fillup')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => createBooking(e, router)} className='flex flex-col gap-4 text-muted-foregeground w-full sm:w-96 relative'>

                        <div className="w-full items-center gap-1.5">
                            <Label htmlFor="meetingInfoID">{t('meeting.h1')}</Label>
                            <Select onValueChange={(meetingInfoID) => setBookingFormData({ ...bookingFormData, meetingInfoID })} value={bookingFormData.meetingInfoID}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('meeting.select.h1')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{bookingFormData.meetingInfoID && supplierMeetingInfo && supplierMeetingInfo.length === 0 ? t('meeting.no_meeting') : !bookingFormData.supplierID ? t('supplier.select.first') : t('user.supplier')}</SelectLabel>
                                        {bookingFormData.supplierID && supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                                            <SelectItem value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</SelectItem>
                                        )) : null}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full items-center gap-1.5">
                            <Label>{t('side_nav.course')}</Label>
                            <Select onValueChange={(courseID) => setBookingFormData({ ...bookingFormData, courseID })} value={bookingFormData.courseID}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('course.select')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{cardCourses && cardCourses.length > 0 ? t('side_nav.course') : t('card.select.first')}</SelectLabel>
                                        {cardCourses && cardCourses.length > 0 ? cardCourses.map(card => (
                                            <SelectItem value={card.id} key={card.id}>{card.name}</SelectItem>
                                        )) : null}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex flex-col mt-3 pt-3 border-t gap-2'>
                            <label htmlFor="" className='px-1 font-medium w-full text-center'>{t('schedule.select')}</label>
                            <div className='flex w-full items-center gap-5'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left gap-3 font-normal",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <FontAwesomeIcon icon={faCalendar} width={16} height={16} />
                                            {selectedDate && isValid(new Date(selectedDate))
                                                ? format(new Date(selectedDate), "PPP")
                                                : <span>{t('info.date.h1')}</span>
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(new Date(selectedDate).setHours(0, 0, 0, 0))}
                                            onSelect={(date) => {
                                                const adjustedDate = new Date(date!);
                                                adjustedDate.setHours(0, 0, 0, 0);
                                                // Check if the adjusted date is valid
                                                if (!isNaN(adjustedDate.getTime())) {
                                                    const formattedDate = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}`;
                                                    setSelectedDate(formattedDate)
                                                } else {
                                                    // If the date is not valid, set scheduleID to an empty string
                                                    setSelectedDate('')
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Select onValueChange={(scheduleID) => setBookingFormData({ ...bookingFormData, scheduleID })} value={bookingFormData.scheduleID}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('info.time.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{bookingFormData.supplierID && scheduleTime && scheduleTime.length === 0 ? t('schedule.no-_chedule') : !bookingFormData.supplierID ? t('supplier.select.first') : t('info.time.h1')}</SelectLabel>
                                            {bookingFormData.supplierID && scheduleTime && scheduleTime.length > 0 ? scheduleTime && scheduleTime.map(schedule => (
                                                <SelectItem value={schedule.id} key={schedule.id}>{schedule.time}</SelectItem>
                                            )) : null}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="note">{t('info.note')}</Label>
                            <Input type="text" name='note' value={bookingFormData.note} onChange={handleChange} placeholder={`${t('info.note')} ${t('global.optional')}`} />
                        </div>

                        <div className='w-full flex items-center gap-5 mt-auto'>
                            <Button type='button' variant={'ghost'} className='w-full' onClick={closeBookingModal}>{t('operation.close')}</Button>
                            <SubmitButton msg={t('operation.confirm')} style='w-full' />
                        </div>

                    </form>
                </CardContent>
            </Card>

        </div>
    )
}

export default ClientBookingModal