/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminBookingStore, { bookingFormDataValue } from '@/lib/state/super-admin/bookingStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/utils'
import { format, isValid } from "date-fns"
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import Err from '@/components/global/Err'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import SubmitButton from '@/components/global/SubmitButton'
const Page = () => {

    const router = useRouter()

    const { departmentID } = useDepartmentStore()
    const { isSideNavOpen } = useGlobalStore()
    const { bookingFormData, setBookingFormData, createBookingRequest } = useAdminBookingStore()
    const { getClientsWithCards, clientWithCards, clientCards, setClientCards, getClientCards } = useAdminClientStore()
    const { supplierWithMeeting, getSupplierWithMeeting, cardCourses, getCardCourses, setSupplierSchedule, supplierMeetingInfo, getSupplierMeetingInfo } = useAdminSupplierStore()
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }

    const getSupplierSchedule = async () => {
        try {

            const { data } = await axios.get('/api/booking/supplier/schedule', {
                params: { supplierID: bookingFormData.supplierID }
            })

            if (data.ok) { setSupplierSchedule(data.data) }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {
        if (bookingFormData.clientID) {
            getClientCards(bookingFormData.clientID)
        }
    }, [bookingFormData.clientID])

    useEffect(() => {

        if (bookingFormData.supplierID) {
            getSupplierSchedule()
            getSupplierMeetingInfo(bookingFormData.supplierID)
        }
    }, [bookingFormData.supplierID])

    useEffect(() => {
        if (bookingFormData.clientCardID) {
            getCardCourses(bookingFormData.clientCardID)
        }
    }, [bookingFormData.clientCardID])

    useEffect(() => {
        setBookingFormData(bookingFormDataValue)
    }, [])

    useEffect(() => {
        setClientCards([])
        getSupplierWithMeeting()
        getClientsWithCards()
    }, [departmentID])

    const t = useTranslations()

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('booking.request.create')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        <Link href={'/admin/manage/booking/request'} className='flex items-center text-muted-foreground justify-center hover:text-primary cursor-pointer gap-1'>
                            <div>{t('booking.request.manage')}</div>
                        </Link>
                    </ul>
                </nav>
                <div className='w-full px-8'>
                    <Card className='w-1/3 h-full'>
                        <CardHeader>
                            <CardTitle>{t('booking.request.manage')}</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => createBookingRequest(e, { router, date: selectedDate, time: selectedTime })} className='w-full'>
                                <Err />
                                <div className='flex w-full h-full gap-10'>
                                    <div className='flex flex-col w-full gap-4'>
                                        <Departments />

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="name">{t("info.name")}</Label>
                                            <Input type="text" id="name" name='name' placeholder={t("info.name")} value={bookingFormData.name} onChange={handleChange} />
                                        </div>

                                        <div className="w-full items-center gap-1.5">
                                            <Label htmlFor="supplierID">{t('user.supplier')}</Label>
                                            <Select onValueChange={(supplierID) => setBookingFormData({ ...bookingFormData, supplierID })} value={bookingFormData.supplierID}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('supplier.select.h1')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{departmentID && supplierWithMeeting.length === 0 ? t('supplier.no_data') : t('user.supplier')}</SelectLabel>
                                                        {supplierWithMeeting.length > 0 ? supplierWithMeeting.map(sup => (
                                                            <SelectItem value={sup.id} key={sup.id}>{sup.name}</SelectItem>
                                                        )) : null}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Label>{t("schedule.h1")}</Label>
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
                                            <Input type='time' value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                                        </div>
                                        <div className="w-full items-center gap-1.5">
                                            <Label htmlFor="meetingInfoID">{t('meeting.h1')}</Label>
                                            <Select onValueChange={(meetingInfoID) => setBookingFormData({ ...bookingFormData, meetingInfoID })} value={bookingFormData.meetingInfoID}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('meeting.select.h1')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{bookingFormData.meetingInfoID && supplierMeetingInfo && supplierMeetingInfo.length === 0 ? t('supplier.no_meeting') : !bookingFormData.supplierID ? t('supplier.select.first') : t('user.supplier')}</SelectLabel>
                                                        {bookingFormData.supplierID && supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                                                            <SelectItem value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</SelectItem>
                                                        )) : null}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button type='button' onClick={() => router.push('/admin/manage/booking/request')} className='mt-10' variant={'ghost'}>{t('operation.cancel')}</Button>

                                    </div>
                                    <div className='flex flex-col w-full gap-4'>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="note">{t("info.note")}</Label>
                                            <Input type="text" id="note" name='note' placeholder={t("info.note")} value={bookingFormData.note} onChange={handleChange} />
                                        </div>

                                        <div className="w-full items-center gap-1.5">
                                            <Label>{t('user.client')}</Label>
                                            <Select onValueChange={(clientID) => setBookingFormData({ ...bookingFormData, clientID })} value={bookingFormData.clientID}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('client.select.h1')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{departmentID && clientWithCards.length === 0 ? t('client.no_ddata') : t('user.client')}</SelectLabel>
                                                        {clientWithCards.length > 0 ? clientWithCards.map(client => (
                                                            <SelectItem value={client.id} key={client.id}>{client.username}</SelectItem>
                                                        )) : null}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-full items-center gap-1.5">
                                            <Label>{t('card.h1')}</Label>
                                            <Select onValueChange={(clientCardID) => setBookingFormData({ ...bookingFormData, clientCardID })} value={bookingFormData.clientCardID}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('card.select.h1')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{clientCards.length === 0 ? t('client.select.first') : t('card.h1')}</SelectLabel>
                                                        {clientCards.length > 0 ? clientCards.map(card => (
                                                            <SelectItem value={card.id} key={card.id}>{card.name}</SelectItem>
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

                                        <div className='w-full border-b pb-1 text-center'>{t("info.quantity")}</div>
                                        <div className='flex w-full items-center gap-5'>

                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="client_quantity">{t("user.client")}</Label>
                                                <Input type="number" id="client_quantity" name='client_quantity'
                                                    value={bookingFormData.client_quantity}
                                                    onChange={handleChange} />
                                            </div>

                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="supplier_quantity">{t("user.supplier")}</Label>
                                                <Input type="number" id="supplier_quantity" name='supplier_quantity'
                                                    value={bookingFormData.supplier_quantity}
                                                    onChange={handleChange} />
                                            </div>

                                        </div>

                                        <SubmitButton msg={t('operation.create')} style='mt-auto' />
                                    </div>

                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )

}

export default Page