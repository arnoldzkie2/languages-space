/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import useClientStore from '@/lib/state/client/clientStore'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Err from '../global/Err'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { useTranslations } from 'next-intl'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
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

const ClientBookingRequestModal = () => {

    const router = useRouter()

    const clearAvailableSuppliers = useClientStore(state => state.clearAvailableSuppliers)
    const { closeBookingRequestModal, createBookingRequest } = useClientBookingStore()
    const { bookingFormData, setBookingFormData } = useAdminBookingStore()
    const { supplierMeetingInfo, getSupplierMeetingInfo, cardCourses } = useAdminSupplierStore()
    const bookingRequestModal = useClientBookingStore(state => state.bookingRequestModal)

    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const defaultDate = `${year}-${month}-${day}`;
        setSelectedDate(defaultDate)
    }, [])

    useEffect(() => {

        if (!bookingFormData.clientCardID && bookingRequestModal) {
            closeBookingRequestModal()
            clearAvailableSuppliers()
            alert('Select Card First')
        }

        if (bookingFormData.supplierID) {
            getSupplierMeetingInfo(bookingFormData.supplierID)
        }

    }, [bookingFormData.supplierID, bookingRequestModal])

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    if (!bookingRequestModal) return null

    return (
        <div className='fixed top-0 right-0 h-screen w-screen backdrop-blur z-20 bg-opacity-40 flex items-center justify-center py-20 px-5'>
            <Card>
                <CardHeader>
                    <CardTitle>{t('booking.fillup')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => createBookingRequest(e, { router, time: selectedTime, date: selectedDate })} className='flex flex-col gap-4 text-muted-foregeground w-full sm:w-96 relative'>

                        <div className="w-full items-center gap-1.5">
                            <Label htmlFor="meetingInfoID">{tt('meeting')}</Label>
                            <Select onValueChange={(meetingInfoID) => setBookingFormData({ ...bookingFormData, meetingInfoID })} value={bookingFormData.meetingInfoID}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={ttt('supplier.select-meeting')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{bookingFormData.meetingInfoID && supplierMeetingInfo && supplierMeetingInfo.length === 0 ? ttt('supplier.no-meeting') : !bookingFormData.supplierID ? ttt('supplier.select-first') : tt('supplier')}</SelectLabel>
                                        {bookingFormData.supplierID && supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                                            <SelectItem value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</SelectItem>
                                        )) : null}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full items-center gap-1.5">
                            <Label>{tt('course')}</Label>
                            <Select onValueChange={(courseID) => setBookingFormData({ ...bookingFormData, courseID })} value={bookingFormData.courseID}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={ttt('booking.select-course')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>{cardCourses && cardCourses.length > 0 ? tt('course') : ttt('client-card.select-first')}</SelectLabel>
                                        {cardCourses && cardCourses.length > 0 ? cardCourses.map(card => (
                                            <SelectItem value={card.id} key={card.id}>{card.name}</SelectItem>
                                        )) : null}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex flex-col mt-3 pt-3 border-t gap-2'>
                            <label htmlFor="" className='px-1 font-medium w-full text-center'>{ttt('schedule.select')}</label>
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
                                                : <span>{tt('date')}</span>
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
                                <Input type='time' value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="note">{tt('note')}</Label>
                            <Input type="text" name='note' value={bookingFormData.note} onChange={handleChange} placeholder={`${tt('note')} ${tt('optional')}`} />
                        </div>

                        <div className='w-full flex items-center gap-5 mt-auto'>
                            <Button type='button' variant={'ghost'} className='w-full' onClick={closeBookingRequestModal}>{tt('close')}</Button>
                            <SubmitButton msg={tt('confirm')} style='w-full' />
                        </div>

                    </form>
                </CardContent>
            </Card>

        </div>
    )
}

export default ClientBookingRequestModal