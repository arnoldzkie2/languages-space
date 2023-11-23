/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Courses, Supplier, SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'

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

  const [formData, setFormData] = useState({
    name: '',
    note: '',
    scheduleID: '',
    supplierID: '',
    clientID: '',
    status: '',
    settlement: '',
    quantity: 1,
    clientCardID: '',
    meeting_info: {
      id: '',
      service: '',
      meeting_code: ''
    },
    courseID: '',
  })

  const { isSideNavOpen, err, setErr, isLoading, setIsLoading, departmentID, setDepartmentID } = useAdminGlobalStore()
  const { getClientsWithCards, clients, clientCards, getClientCards, setClientCards } = useAdminClientStore()
  const { supplier, getSupplierWithMeeting, cardCourses, setCardCourses,
    supplierSchedule, setSupplierSchedule,
    singleSupplier, getSingleSupplier } = useAdminSupplierStore()

  const handleChange = (e: any) => {
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

  const retrieveBooking = async () => {
    try {

      const { data } = await axios.get('/api/booking', {
        params: { bookingID: params.bookingID }
      })

      if (data.ok) {
        setFormData(data.data)
        setDepartmentID(data.data.departmentID)
      }

    } catch (error) {
      console.log(error);
      alert('Something went wrong')
    }
  }

  useEffect(() => {

    retrieveBooking()

  }, [params.bookingID])

  const updateBooking = async (e: any) => {

    e.preventDefault()

    try {

      const { clientCardID, clientID, status, meeting_info, supplierID, scheduleID, note, courseID, name, quantity, settlement } = formData

      if (!name) return setErr('Write Name for this booking')
      if (!clientID) return setErr('Select Client')
      if (!clientCardID) return setErr('Select Card')
      if (!meeting_info.id) return setErr('Select Meeting Info')
      if (!supplierID) return setErr('Select Supplier')
      if (quantity < 1) return setErr('Quantity must be greater than 0')
      if (!departmentID) return setErr('Select Department')
      if (!scheduleID) return setErr('Select Schedule')
      if (!courseID) return setErr('Select Course')
      if (!settlement) return setErr('Select Settlement Period')

      setIsLoading(true)
      const { data } = await axios.patch('/api/booking', {
        note, clientCardID, clientID, meeting_info,
        supplierID, scheduleID, courseID, departmentID, settlement,
        name, operator: 'Admin', status, quantity: Number(quantity)
      }, {
        params: { bookingID: params.bookingID }
      })

      if (data.ok) {
        setIsLoading(false)
        router.push('/manage/booking')
      }

    } catch (error) {
      setIsLoading(false)
      console.log(error);
      alert('Something went wrong')
    }

  }

  const getCourses = async () => {
    try {

      const { data } = await axios.get('/api/courses', {
        params: { cardID: formData.clientCardID }
      })

      if (data.ok) {
        setCardCourses(data.data)
      }

    } catch (error) {
      console.log(error);
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
      getCourses()
    }

  }, [formData.clientCardID])

  useEffect(() => {
    setClientCards([])
    setCardCourses([])
    getSupplierWithMeeting()
    getClientsWithCards()
  }, [departmentID])

  useEffect(() => {
    setDepartmentID('')
  }, [])

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
          <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.update')}</h1>
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
          <form onSubmit={updateBooking} className='bg-white w-1/3 h-full border p-10'>
            <div className='flex w-full h-full gap-10'>
              <div className='flex flex-col w-full gap-4'>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="department">{t('department.select')}</label>
                  <Departments />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="name" className='text-gray-700 font-medium px-3'>{tt('name')}</label>
                  <input type="text" id='name' name='name' placeholder={tt('name')} value={formData.name} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="status" className='text-gray-700 font-medium px-3'>{tt('status')}</label>
                  <select name="status" className='outline-none px-3 py-1' id="status" value={formData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="invoiced">Invoiced</option>
                    <option value="settled">Settled</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="supplierID" className='text-gray-700 font-medium px-3'>{tt('supplier')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="supplierID" value={formData.supplierID} onChange={handleChange} id="supplierID">
                    <option value="">{t('supplier.select')}</option>
                    {supplier.length > 0 ? supplier.map(sup => (
                      <option value={sup.id} key={sup.id}>{sup.name}</option>
                    )) : ''}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="scheduleID" className='text-gray-700 font-medium px-3'>{tt('schedule')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="scheduleID" value={formData.scheduleID} onChange={handleChange} id="scheduleID">
                    <option value="">{t('booking.select-schedule')}</option>
                    {formData.supplierID && supplierSchedule.length > 0 ? supplierSchedule.map(schedule => (
                      <option value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time}) {schedule.status === 'reserved' && '(reserved)'}</option>
                    )) : formData.supplierID && supplierSchedule.length < 1 ? <option disabled>{t('schedule.no-schedule')}</option> : <option disabled>{t('supplier.select-first')}</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="supplierID" className='text-gray-700 font-medium px-3'>{t('supplier.select-meeting')}</label>
                  <ul className='flex flex-col'>
                    {singleSupplier?.meeting_info.map((info: SupplierMeetingInfo) => (
                      <li key={info.id}
                        className={`cursor-pointer px-3 py-1 ${formData.meeting_info.id === info.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'} border`}
                        onClick={() => setFormData(prevData => ({ ...prevData, meeting_info: info }))}>
                        {info.service} ({info.meeting_code})</li>
                    ))}
                  </ul>
                </div>

                <Link href={'/manage/booking'} className='border w-full py-2 flex items-center justify-center hover:bg-slate-100'>{t('global.cancel')}</Link>

              </div>
              <div className='flex flex-col w-full gap-4'>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="note" className='text-gray-700 font-medium px-3'>{tt('note')} (optional)</label>
                  <input type="text" id='note' name='note' placeholder={tt('note')} value={formData.note} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="clientID" className='text-gray-700 font-medium px-3'>{tt('client')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="clientID" value={formData.clientID} onChange={handleChange} id="clientID">
                    <option value="">{t('client.select')}</option>
                    {clients.length > 0 ? clients.map(client => (
                      <option value={client.id} key={client.id}>{client.name}</option>
                    )) : ''}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="clientCardID" className='text-gray-700 font-medium px-3'>{tt('clientcard')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="clientCardID" value={formData.clientCardID} onChange={handleChange} id="clientCardID">
                    <option value="">{t('booking.clientcard-select')}</option>
                    {clientCards.length > 0 ? clientCards.map(card => (
                      <option value={card.id} key={card.id}>{card.name} ({card.balance})</option>
                    )) : <option disabled>{t('client.select-first')}</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="courseID" className='text-gray-700 font-medium px-3'>{tt('course')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="courseID" value={formData.courseID} onChange={handleChange} id="courseID">
                    <option value="">{t('booking.select-course')}</option>
                    {cardCourses.length > 0 ? cardCourses.map(card => (
                      <option value={card.id} key={card.id}>{card.name}</option>
                    )) : <option disabled>{t('client-card.select-first')}</option>}
                  </select>
                </div>


                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="quantity" className='text-gray-700 font-medium px-3'>{tt('settlement')}</label>
                  <input type="date" required className='w-full px-3 py-1.5 border outline-none' value={formData.settlement} name='settlement' onChange={handleChange} />
                </div>


                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="quantity" className='text-gray-700 font-medium px-3'>{tt('quantity')}</label>
                  <input type="number" className='w-full px-3 py-1.5 border outline-none' value={formData.quantity} name='quantity' onChange={handleChange} />
                </div>

                <button disabled={isLoading} className={`w-full py-2 text-white rounded-md mt-5 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('booking.update')}</button>

              </div>

              <div>

              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  )

}

export default Page