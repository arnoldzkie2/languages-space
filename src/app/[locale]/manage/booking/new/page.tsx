/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import SideNav from '@/components/super-admin/SideNav'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Courses, Supplier, SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {

  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    note: '',
    scheduleID: '',
    status: 'pending',
    supplierID: '',
    clientID: '',
    clientCardID: '',
    price: 0,
    meeting_info: {
      id: '',
      service: '',
      meeting_code: ''
    },
    courseID: '',
  })

  const { isSideNavOpen, err, setErr, isLoading, setIsLoading } = useAdminGlobalStore()
  const { getClientsWithCards, clients, clientCards, getClientCards } = useAdminClientStore()
  const { supplier, getSupplierWithMeeting, cardCourses, setCardCourses, supplierData,
    setSupplierData, supplierSchedule, setSupplierSchedule,
    singleSupplier, getSingleSupplier } = useAdminSupplierStore()

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const session = useSession()

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

  const createBooking = async (e: any) => {

    e.preventDefault()

    try {

      const { clientCardID, clientID, meeting_info, supplierID, scheduleID, price, note, courseID, name, status } = formData

      if (!name) return setErr('Write Name for this booking')
      if (!clientID) return setErr('Select Client')
      if (!clientCardID) return setErr('Select Card')
      if (!meeting_info.id) return setErr('Select Meeting Info')
      if (!supplierID) return setErr('Select Supplier')
      if (!scheduleID) return setErr('Select Schedule')
      if (!courseID) return setErr('Select Course')
      if (!price) return setErr('Price must be positive number')

      setIsLoading(true)
      const { data } = await axios.post('/api/booking', {
        note, clientCardID, clientID, meeting_info,
        supplierID, scheduleID, price: Number(price), courseID,
        name, operator: 'Admin', status
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

  const getSupplierPrice = async () => {
    try {

      const { data } = await axios.get('/api/supplier/price', {
        params: { clientCardID: formData.clientCardID, supplierID: formData.supplierID }
      })

      if (data.ok) setFormData(prevData => ({ ...prevData, price: data.data }))

    } catch (error: any) {
      console.log(error);
      if (error.response.data.error === 'supplier_not_supported') {
        setFormData(prevData => ({ ...prevData, cardSelectedID: '' }))
        return alert('Supplier is not suppported in this card')
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
      getCourses()
      getSupplierPrice()
    }

  }, [formData.clientCardID])

  useEffect(() => {
    getSupplierWithMeeting()
    getClientsWithCards()
  }, [])

  const t = useTranslations('super-admin')
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
                  <label htmlFor="name" className='text-gray-700 font-medium px-3'>{t('booking.name')}</label>
                  <input type="text" id='name' name='name' placeholder={t('booking.name')} value={formData.name} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="status" className='text-gray-700 font-medium px-3'>{t('booking.status')}</label>
                  <select name="status" className='outline-none px-3 py-1' id="status" value={formData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="supplierID" className='text-gray-700 font-medium px-3'>{t('booking.supplier')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="supplierID" value={formData.supplierID} onChange={handleChange} id="supplierID">
                    <option value="">{t('supplier.select')}</option>
                    {supplier.length > 0 ? supplier.map(sup => (
                      <option value={sup.id} key={sup.id}>{sup.name}</option>
                    )) : ''}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="scheduleID" className='text-gray-700 font-medium px-3'>{t('booking.schedule')}</label>
                  <select className='px-3 py-1.5 w-full outline-none border' name="scheduleID" value={formData.scheduleID} onChange={handleChange} id="scheduleID">
                    <option value="">{t('booking.select-schedule')}</option>
                    {supplierSchedule.length > 0 ? supplierSchedule.map(schedule => (
                      <option value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time}) {schedule.status === 'reserved' && '(reserved)'}</option>
                    )) : <option disabled>Select Supplier First.</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="supplierID" className='text-gray-700 font-medium px-3'>{t('booking.meeting-info')}</label>
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
                  <label htmlFor="note" className='text-gray-700 font-medium px-3'>{t('booking.note')} (optional)</label>
                  <input type="text" id='note' name='note' placeholder={t('booking.note')} value={formData.note} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="clientID" className='text-gray-700 font-medium px-3'>{t('booking.client')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="clientID" value={formData.clientID} onChange={handleChange} id="clientID">
                    <option value="">{t('client.select')}</option>
                    {clients.length > 0 ? clients.map(client => (
                      <option value={client.id} key={client.id}>{client.name}</option>
                    )) : ''}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="clientCardID" className='text-gray-700 font-medium px-3'>{t('booking.clientcard')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="clientCardID" value={formData.clientCardID} onChange={handleChange} id="clientCardID">
                    <option value="">{t('booking.clientcard-select')}</option>
                    {clientCards.length > 0 ? clientCards.map(card => (
                      <option value={card.id} key={card.id}>{card.name} ({card.balance})</option>
                    )) : <option disabled>Select Client First.</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="courseID" className='text-gray-700 font-medium px-3'>{t('booking.course')}</label>
                  <select required className='px-3 py-1.5 w-full outline-none border' name="courseID" value={formData.courseID} onChange={handleChange} id="courseID">
                    <option value="">{t('booking.select-course')}</option>
                    {cardCourses.length > 0 ? cardCourses.map(card => (
                      <option value={card.id} key={card.id}>{card.name}</option>
                    )) : <option disabled>Select Card First.</option>}
                  </select>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <label htmlFor="price" className='text-gray-700 font-medium px-3'>{t('booking.price')}</label>
                  <input required type="number" className='px-3 py-1 w-full outline-none border' value={formData.price} onChange={handleChange} name='price' />
                </div>

                <button disabled={isLoading} className={`w-full py-2 text-white rounded-md mt-6 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
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