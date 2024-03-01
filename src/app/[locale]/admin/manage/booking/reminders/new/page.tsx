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
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Courses, SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import { cn } from '@/utils'
import { ADMIN, PENDING } from '@/utils/constants'
import { faCalendar, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { format, isValid, set } from 'date-fns'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {

  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    note: '',
    scheduleID: '',
    supplierID: '',
    clientID: '',
    settlement: '',
    clientCardID: '',
    client_quantity: '1',
    supplier_quantity: '1',
    meeting_info: {
      id: '',
      service: '',
      meeting_code: ''
    },
    courseID: '',
  })
  const { departmentID } = useDepartmentStore()
  const { isSideNavOpen, setErr, setIsLoading } = useGlobalStore()
  const { getClientsWithCards, clientWithCards, clientCards, getClientCards, setClientCards } = useAdminClientStore()
  const { supplierWithMeeting, getSupplierWithMeeting, cardCourses, getCardCourses, clearCardCourses,
    supplierSchedule, setSupplierSchedule,
    singleSupplier, getSingleSupplier } = useAdminSupplierStore()
  const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const getSupplierSchedule = async () => {
    try {

      const { data } = await axios.get('/api/schedule', {
        params: { supplierID: formData.supplierID }
      })

      if (data.ok) { setSupplierSchedule(data.data) }

    } catch (error) {
      console.log(error);
      alert('Something went wrong')
    }
  }

  const createReminders = async (e: React.FormEvent) => {
    e.preventDefault()
    try {

      const { clientCardID, clientID, meeting_info, supplierID, scheduleID, note, courseID, name, client_quantity, supplier_quantity, settlement } = formData

      if (!name) return setErr('Write Name for this booking reminders')

      setIsLoading(true)
      const { data } = await axios.post('/api/booking/reminders', {
        note, clientCardID, clientID, meeting_info,
        supplierID, scheduleID,
        client_quantity: Number(client_quantity),
        supplier_quantity: Number(supplier_quantity),
        courseID,
        name, operator: ADMIN, status: PENDING, settlement
      })

      if (data.ok) {
        toast.success("Success! reminders created.")
        router.push('/admin/manage/booking/reminders')
        setIsLoading(false)
      }

    } catch (error: any) {
      setIsLoading(false)
      console.log(error);
      if (error.response.data.msg) {
        return setErr(error.response.data.msg)
      }
      alert('Something went wrong')
    }
  }

  useEffect(() => {

    if (formData.clientID) {
      getClientCards(formData.clientID)
    }

  }, [formData.clientID])

  useEffect(() => {

    if (formData.supplierID) {
      getSingleSupplier(formData.supplierID)
      getSupplierSchedule()
    }

  }, [formData.supplierID])

  useEffect(() => {

    if (formData.clientCardID) {
      getCardCourses(formData.clientCardID)
    }

  }, [formData.clientCardID])

  useEffect(() => {
    setClientCards([])
    getSupplierWithMeeting()
    clearCardCourses()
    getClientsWithCards()
  }, [departmentID])


  const t = useTranslations()

  return (
    <div className='h-screen'>
      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
          <h1 className='font-black text-xl uppercase'>{t('booking.reminders.create')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
            <Link href={'/admin/manage/booking/reminders'} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
              <div>{t('booking.reminders.h1')}</div>
            </Link>
            {isAdminAllowed('view_booking') &&
              <Link href={'/admin/manage/booking'} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                <div>{t('booking.manage')}</div>
              </Link>}
          </ul>
        </nav>
        <div className='w-full px-8 h-full'>
          <Card className='w-1/3'>
            <CardHeader>
              <CardTitle>{t("booking.reminders.create")}</CardTitle>
              <CardDescription><Err /></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createReminders} className='w-full'>

                <div className='flex w-full h-full gap-10'>
                  <div className='flex flex-col w-full gap-4'>

                    <Departments />

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">{t("info.name")}</Label>
                      <Input type="text" id="name" name='name' placeholder={t("info.name")} value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="supplierID">{t('user.supplier')}</Label>
                      <Select onValueChange={(supplierID) => setFormData(prev => ({ ...prev, supplierID }))} value={formData.supplierID}>
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

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="scheduleID">{t('schedule.h1')}</Label>
                      <Select onValueChange={(scheduleID) => setFormData(prev => ({ ...prev, scheduleID }))} value={formData.scheduleID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('schedule.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{formData.supplierID && supplierSchedule.length === 0 ? t('schedule.no_schedule') : !formData.supplierID ? t('supplier.select.first') : t('user.supplier')}</SelectLabel>
                            {formData.supplierID && supplierSchedule.length > 0 ? supplierSchedule.map(schedule => (
                              <SelectItem value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time}) {schedule.status === 'reserved' && '(reserved)'}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                      <Label htmlFor="meetingInfo" className=''>{t('meeting.h1')}</Label>
                      <ul className='flex flex-col gap-2'>
                        {singleSupplier?.meeting_info.map((info: SupplierMeetingInfo) => (
                          <li key={info.id}
                            className={`cursor-pointer px-3 py-1 ${formData.meeting_info.id === info.id ? 'bg-primary' : 'hover:bg-primary bg-muted'} border`}
                            onClick={() => setFormData(prevData => ({ ...prevData, meeting_info: info }))}>
                            {info.service} ({info.meeting_code})</li>
                        ))}
                      </ul>
                    </div>

                    <Button type='button'
                      variant={'ghost'} className='w-full mt-auto'
                      onClick={() => router.push('/admin/manage/booking/reminders')}>{t("operation.cancel")}</Button>

                  </div>
                  <div className='flex flex-col w-full gap-4'>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="note">{t("info.note")}</Label>
                      <Input type="text" id="note" name='note' placeholder={t("info.note")} value={formData.note} onChange={handleChange} />
                    </div>

                    <div className="w-full items-center gap-1.5">
                      <Label>{t('user.client')}</Label>
                      <Select onValueChange={(clientID) => setFormData(prev => ({ ...prev, clientID }))} value={formData.clientID}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('client.select.h1')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{departmentID && clientWithCards.length === 0 ? t('client.no_data') : t('user.client')}</SelectLabel>
                            {clientWithCards.length > 0 ? clientWithCards.map(client => (
                              <SelectItem value={client.id} key={client.id}>{client.username}</SelectItem>
                            )) : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full items-center gap-1.5">
                      <Label>{t('card.h1')}</Label>
                      <Select onValueChange={(clientCardID) => setFormData(prev => ({ ...prev, clientCardID }))} value={formData.clientCardID}>
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
                      <Select onValueChange={(courseID) => setFormData(prev => ({ ...prev, courseID }))} value={formData.courseID}>
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


                    <div className="w-full items-center gap-1.5">
                      <Label>{t('info.settlement')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left gap-3 font-normal",
                              !formData.settlement && "text-muted-foreground"
                            )}
                          >
                            <FontAwesomeIcon icon={faCalendar} width={16} height={16} />
                            {formData.settlement && isValid(new Date(formData.settlement))
                              ? format(new Date(formData.settlement), "PPP")
                              : <span>{t('operation.select')}</span>
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(new Date(formData.settlement).setHours(0, 0, 0, 0))}
                            onSelect={(date) => {
                              const adjustedDate = new Date(date!);
                              adjustedDate.setHours(0, 0, 0, 0);

                              // Check if the adjusted date is valid
                              if (!isNaN(adjustedDate.getTime())) {
                                const formattedDate = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}`;
                                setFormData(prev => ({ ...prev, settlement: formattedDate }))
                              } else {
                                // If the date is not valid, set settlement to an empty string
                                setFormData(prev => ({ ...prev, settlement: '' }))
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className='w-full border-b pb-1 text-center'>{t("info.quantity")}</div>

                    <div className='flex w-full items-center gap-5'>

                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="client_quantity">{t("user.client")}</Label>
                        <Input type="number" id="client_quantity" name='client_quantity'
                          value={formData.client_quantity}
                          onChange={handleChange} />
                      </div>

                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="supplier_quantity">{t("user.supplier")}</Label>
                        <Input type="number" id="supplier_quantity" name='supplier_quantity'
                          value={formData.supplier_quantity}
                          onChange={handleChange} />
                      </div>

                    </div>

                    <SubmitButton style='mt-auto w-full' msg={t('operation.create')} />
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