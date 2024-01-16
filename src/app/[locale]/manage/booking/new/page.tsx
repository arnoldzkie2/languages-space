/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminBookingStore, { bookingFormDataValue } from '@/lib/state/super-admin/bookingStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { ADMIN } from '@/utils/constants'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {

  const session = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const router = useRouter()

  const { isSideNavOpen, err, setErr, isLoading, setIsLoading, departmentID, setDepartmentID } = useGlobalStore()
  const { bookingFormData, setBookingFormData } = useAdminBookingStore()
  const { getClientsWithCards, clientWithCards, clientCards, setClientCards, getClientCards } = useAdminClientStore()
  const { supplier, getSupplierWithMeeting, cardCourses, getCardCourses, supplierSchedule, setSupplierSchedule, supplierMeetingInfo, getSupplierMeetingInfo } = useAdminSupplierStore()

  const handleChange = (e: any) => {
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

  const createBooking = async (e: any) => {

    e.preventDefault()

    try {

      const { clientCardID, clientID, meetingInfoID, supplierID, scheduleID, note, courseID, name, status, quantity, settlement } = bookingFormData

      if (!name) return setErr('Write Name for this booking')
      if (!clientID) return setErr('Select Client')
      if (!clientCardID) return setErr('Select Card')
      if (!meetingInfoID) return setErr('Select Meeting Info')
      if (!supplierID) return setErr('Select Supplier')
      if (!scheduleID) return setErr('Select Schedule')
      if (!courseID) return setErr('Select Course')
      if (quantity < 1) return setErr('Quantity must be greater than 0')
      if (!settlement) return setErr('Set Settlement Period')

      setIsLoading(true)
      const { data } = await axios.post('/api/booking', {
        note, clientCardID, clientID, meetingInfoID, settlement,
        supplierID, scheduleID, courseID, quantity: Number(quantity),
        name, operator: ADMIN, status
      })

      if (data.ok) {
        setErr('')
        setIsLoading(false)
        router.push('/manage/booking')
      }

    } catch (error: any) {

      setIsLoading(false)
      if (error.response.data.msg === 'This schedule is already reserved') {
        return setErr('This Schedule is already reserved')
      }
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
    setDepartmentID('')
  }, [])

  useEffect(() => {
    setClientCards([])
    getSupplierWithMeeting()
    getClientsWithCards()
  }, [departmentID])

  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  const clientHeaderSkeleton = (
    <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
  )

  return (
    <div className='h-screen'>
      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
          <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.create')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5'>
            {session.status !== 'loading' ?
              <Link href={'/manage/schedule'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                <div>{t('schedule.h1')}</div>
              </Link> : clientHeaderSkeleton}
            {session.status !== 'loading' ?
              <Link href={'/manage/booking'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                <div>{t('booking.h1')}</div>
              </Link> : clientHeaderSkeleton}
          </ul>
        </nav>
        <div className='w-full px-8 h-full'>
          <form onSubmit={createBooking} className='bg-white w-1/3 h-full border p-10'>

            {err && <small className='text-red-600 mb-2'>{err}</small>}

            <div className='flex w-full h-full gap-10'>
              <div className='flex flex-col w-full gap-4'>
                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="department" className='text-gray-700 font-medium px-3'>{tt('departments')}</label>
                  <Departments />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="name" className='text-gray-700 font-medium px-3'>{tt('name')}</label>
                  <input type="text" id='name' name='name' placeholder={tt('name')} value={bookingFormData.name} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="status" className='text-gray-700 font-medium px-3'>{tt('status')}</label>
                  <select name="status" className='outline-none px-3 py-1.5' id="status" value={bookingFormData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="invoiced">Invoiced</option>
                    <option value="settled">Settled</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="supplierID" className='text-gray-700 font-medium px-3'>{tt('supplier')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="supplierID" value={bookingFormData.supplierID} onChange={handleChange} id="supplierID">
                    <option value="">{t('supplier.select')}</option>
                    {supplier.length > 0 ? supplier.map(sup => (
                      <option value={sup.id} key={sup.id}>{sup.name}</option>
                    )) : ''}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="scheduleID" className='text-gray-700 font-medium px-3'>{tt('schedule')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="scheduleID" value={bookingFormData.scheduleID} onChange={handleChange} id="scheduleID">
                    <option value="">{t('booking.select-schedule')}</option>
                    {bookingFormData.supplierID && supplierSchedule.length > 0 ? supplierSchedule.map(schedule => (
                      <option value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time}) {schedule.status === 'reserved' && '(reserved)'}</option>
                    )) : bookingFormData.supplierID && supplierSchedule.length < 1 ? <option disabled>{t('schedule.no-schedule')}</option> : <option disabled>{t('supplier.select-first')}</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="meetingInfoID" className='text-gray-700 font-medium px-3'>{tt('meeting')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="meetingInfoID" value={bookingFormData.meetingInfoID} onChange={handleChange} id="meetingInfoID">
                    <option value="">{t('supplier.select-meeting')}</option>
                    {supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                      <option value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</option>
                    )) : bookingFormData.meetingInfoID && supplierMeetingInfo && supplierMeetingInfo.length < 1 ?
                      <option disabled>{t('schedule.no-schedule')}</option> : <option disabled>{t('supplier.select-first')}</option>}
                  </select>
                </div>

                <Link href={'/manage/booking'} className='border w-full mt-auto py-2 flex items-center justify-center hover:bg-slate-100'>{t('global.cancel')}</Link>

              </div>
              <div className='flex flex-col w-full gap-4'>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="note" className='text-gray-700 font-medium px-3'>{tt('note')} (optional)</label>
                  <input type="text" id='note' name='note' placeholder={tt('note')} value={bookingFormData.note} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="clientID" className='text-gray-700 font-medium px-3'>{tt('client')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="clientID" value={bookingFormData.clientID} onChange={handleChange} id="clientID">
                    <option value="">{t('client.select')}</option>
                    {clientWithCards.length > 0 ? clientWithCards.map(client => (
                      <option value={client.id} key={client.id}>{client.username}</option>
                    )) : ''}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="clientCardID" className='text-gray-700 font-medium px-3'>{tt('clientcard')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="clientCardID" value={bookingFormData.clientCardID} onChange={handleChange} id="clientCardID">
                    <option value="">{t('booking.clientcard-select')}</option>
                    {clientCards.length > 0 ? clientCards.map(card => (
                      <option value={card.id} key={card.id}>{card.name} ({card.balance})</option>
                    )) : <option disabled>{t('client.select-first')}</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="courseID" className='text-gray-700 font-medium px-3'>{tt('course')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="courseID" value={bookingFormData.courseID} onChange={handleChange} id="courseID">
                    <option value="">{t('booking.select-course')}</option>
                    {cardCourses && cardCourses.length > 0 ? cardCourses.map(card => (
                      <option value={card.id} key={card.id}>{card.name}</option>
                    )) : <option disabled>{t('client-card.select-first')}</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="quantity" className='text-gray-700 font-medium px-3'>{tt('settlement')}</label>
                  <input type="date" required className='w-full px-3 py-1.5 border outline-none' value={bookingFormData.settlement} name='settlement' onChange={handleChange} />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="quantity" className='text-gray-700 font-medium px-3'>{tt('quantity')}</label>
                  <input type="number" className='w-full px-3 py-1.5 border outline-none' value={bookingFormData.quantity} name='quantity' onChange={handleChange} />
                </div>

                <button disabled={isLoading} className={`w-full py-2 text-white rounded-md mt-auto ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('booking.create')}</button>

              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  )

}

export default Page