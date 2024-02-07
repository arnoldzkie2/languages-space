/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminBookingStore, { bookingFormDataValue } from '@/lib/state/super-admin/bookingStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { cn } from '@/utils'
import { faCalendar, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { format, isValid, setISODay } from 'date-fns'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

interface Props {
  params: {
    bookingID: string
  }
}

const Page = ({ params }: Props) => {

  const session = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const router = useRouter()

  const { departmentID, setDepartmentID } = useDepartmentStore()
  const { isSideNavOpen } = useGlobalStore()
  const { getClientsWithCards, clientWithCards, clientCards, getClientCards, setClientCards } = useAdminClientStore()
  const { supplierWithMeeting, getSupplierWithMeeting, cardCourses, getCardCourses, clearCardCourses,
    supplierSchedule, setSupplierSchedule, getSupplierMeetingInfo, supplierMeetingInfo } = useAdminSupplierStore()

  const { bookingFormData, setBookingFormData, updateBooking } = useAdminBookingStore()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setBookingFormData({ ...bookingFormData, [name]: value })
  }

  const getSupplierSchedule = async () => {
    try {

      const { data } = await axios.get('/api/schedule', {
        params: { supplierID: bookingFormData.supplierID }
      })

      if (data.ok) { setSupplierSchedule(data.data) }

    } catch (error) {
      console.log(error);
      alert('Something went wrong')
    }
  }

  const retrieveBooking = async () => {
    try {

      const { data } = await axios.get('/api/booking', {
        params: { bookingID: params.bookingID }
      })

      if (data.ok) {
        data.data.meetingInfoID = data.data.meeting_info.id
        setDepartmentID(data.data.departmentID)
        setBookingFormData(data.data)
      }

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
    retrieveBooking()
  }, [])

  useEffect(() => {
    if (departmentID) {
      setClientCards([])
      clearCardCourses()
      getSupplierWithMeeting()
      getClientsWithCards()
    }
  }, [departmentID])

  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  return (
    <div className='h-screen'>
      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-card`}>
          <h1 className='font-black text-xl uppercase'>{t('booking.update')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5'>
            <Link href={'/manage/booking'} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
              <div>{t('booking.h1')}</div>
            </Link>
          </ul>
        </nav>
        <div className='w-full h-full px-8'>
          <Card className='w-1/3 h-full'>
            <CardHeader>
              <CardTitle>{t('booking.update')}</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingFormData.clientID ? <form onSubmit={(e) => updateBooking(e, params.bookingID, router)} className='w-full'>
                <Err />
                <div className='flex w-full h-full gap-10'>
                  <div className='flex flex-col w-full gap-4'>
                    <Departments />

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">{tt("name")}</Label>
                      <Input type="text" id="name" name='name' placeholder={tt("name")} value={bookingFormData.name} onChange={handleChange} />
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="status">{tt('status')}</Label>
                      <Select onValueChange={(status) => setBookingFormData({ ...bookingFormData, status })} value={bookingFormData.status}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={tt('select-status')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{tt('status')}</SelectLabel>
                            <SelectItem value="confirmed">{tt('confirmed')}</SelectItem>
                            <SelectItem value="invoiced">{tt("invoiced")}</SelectItem>
                            <SelectItem value="settled">{tt('settled')}</SelectItem>
                            <SelectItem value="canceled">{tt('canceled')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="supplierID">{tt('supplier')}</Label>
                      <Select onValueChange={(supplierID) => setBookingFormData({ ...bookingFormData, supplierID })} value={bookingFormData.supplierID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('supplier.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{departmentID && supplierWithMeeting.length === 0 ? t('supplier.nodata') : tt('supplier')}</SelectLabel>
                            {supplierWithMeeting.length > 0 ? supplierWithMeeting.map(sup => (
                              <SelectItem value={sup.id} key={sup.id}>{sup.name}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="scheduleID">{tt('schedule')}</Label>
                      <Select onValueChange={(scheduleID) => setBookingFormData({ ...bookingFormData, scheduleID })} value={bookingFormData.scheduleID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('booking.select-schedule')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{bookingFormData.supplierID && supplierSchedule.length === 0 ? t('schedule.no-schedule') : !bookingFormData.supplierID ? t('supplier.select-first') : tt('supplier')}</SelectLabel>
                            {bookingFormData.supplierID && supplierSchedule.length > 0 ? supplierSchedule.map(schedule => (
                              <SelectItem value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time}) {schedule.status === 'reserved' && '(reserved)'}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="meetingInfoID">{tt('meeting')}</Label>
                      <Select onValueChange={(meetingInfoID) => setBookingFormData({ ...bookingFormData, meetingInfoID })} value={bookingFormData.meetingInfoID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('supplier.select-meeting')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{bookingFormData.meetingInfoID && supplierMeetingInfo && supplierMeetingInfo.length === 0 ? t('supplier.no-meeting') : !bookingFormData.supplierID ? t('supplier.select-first') : tt('supplier')}</SelectLabel>
                            {bookingFormData.supplierID && supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                              <SelectItem value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type='button' onClick={() => router.push('/admin/manage/booking')} className='mt-auto' variant={'ghost'}>{t('global.cancel')}</Button>

                  </div>
                  <div className='flex flex-col w-full gap-4'>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="note">{tt("note")}</Label>
                      <Input type="text" id="note" name='note' placeholder={tt("note")} value={bookingFormData.note} onChange={handleChange} />
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label>{tt('client')}</Label>
                      <Select onValueChange={(clientID) => setBookingFormData({ ...bookingFormData, clientID })} value={bookingFormData.clientID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('client.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{departmentID && clientWithCards.length === 0 ? t('client.nodata') : tt('client')}</SelectLabel>
                            {clientWithCards.length > 0 ? clientWithCards.map(client => (
                              <SelectItem value={client.id} key={client.id}>{client.username}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label>{tt('clientcard')}</Label>
                      <Select onValueChange={(clientCardID) => setBookingFormData({ ...bookingFormData, clientCardID })} value={bookingFormData.clientCardID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('booking.clientcard-select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{clientCards.length === 0 ? t('client.select-first') : tt('clientcard')}</SelectLabel>
                            {clientCards.length > 0 ? clientCards.map(card => (
                              <SelectItem value={card.id} key={card.id}>{card.name}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label>{tt('course')}</Label>
                      <Select onValueChange={(courseID) => setBookingFormData({ ...bookingFormData, courseID })} value={bookingFormData.courseID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('booking.select-course')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{cardCourses && cardCourses.length > 0 ? tt('course') : t('client-card.select-first')}</SelectLabel>
                            {cardCourses && cardCourses.length > 0 ? cardCourses.map(card => (
                              <SelectItem value={card.id} key={card.id}>{card.name}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label>{tt('settlement')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left gap-3 font-normal",
                              !bookingFormData.settlement && "text-muted-foreground"
                            )}
                          >
                            <FontAwesomeIcon icon={faCalendar} width={16} height={16} />
                            {bookingFormData.settlement && isValid(new Date(bookingFormData.settlement))
                              ? format(new Date(bookingFormData.settlement), "PPP")
                              : <span>{tt('select-settlement')}</span>
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(new Date(bookingFormData.settlement).setHours(0, 0, 0, 0))}
                            onSelect={(date) => {
                              const adjustedDate = new Date(date!);
                              adjustedDate.setHours(0, 0, 0, 0);

                              // Check if the adjusted date is valid
                              if (!isNaN(adjustedDate.getTime())) {
                                const formattedDate = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}`;
                                setBookingFormData({
                                  ...bookingFormData,
                                  settlement: formattedDate,
                                });
                              } else {
                                // If the date is not valid, set settlement to an empty string
                                setBookingFormData({
                                  ...bookingFormData,
                                  settlement: '',
                                });
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className='w-full border-b pb-1 text-center'>{tt("quantity")}</div>

                    <div className='flex w-full items-center gap-5'>

                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="client_quantity">{tt("client")}</Label>
                        <Input type="number" id="client_quantity" name='client_quantity'
                          value={bookingFormData.client_quantity}
                          onChange={handleChange} />
                      </div>

                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="supplier_quantity">{tt("supplier")}</Label>
                        <Input type="number" id="supplier_quantity" name='supplier_quantity'
                          value={bookingFormData.supplier_quantity}
                          onChange={handleChange} />
                      </div>

                    </div>

                    <SubmitButton msg={tt('update')} style='w-full mt-10' />
                  </div>

                </div>
              </form> : <FontAwesomeIcon icon={faSpinner} width={30} height={30} className='animate-spin' />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

}

export default Page