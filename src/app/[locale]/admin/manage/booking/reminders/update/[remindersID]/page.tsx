/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import AdminSideNav from '@/components/admin/AdminSIdeNav'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import { ADMIN } from '@/utils/constants'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        remindersID: string
    }
}

const Page = ({ params }: Props) => {

    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        note: '',
        scheduleID: '',
        supplierID: '',
        status: '',
        settlement: '',
        clientID: '',
        quantity: 1,
        clientCardID: '',
        meeting_info: {
            id: '',
            service: '',
            meeting_code: ''
        },
        courseID: '',
    })

    const { isSideNavOpen, err, setErr, isLoading, setIsLoading, setDepartmentID, departmentID } = useGlobalStore()
    const { getClientsWithCards, clientWithCards, clientCards, getClientCards, setClientCards } = useAdminClientStore()
    const { supplier, getSupplierWithMeeting, cardCourses, getCardCourses, clearCardCourses,
        supplierSchedule, setSupplierSchedule,
        singleSupplier, getSingleSupplier } = useAdminSupplierStore()
    const permissions = useAdminPageStore(s => s.permissions)

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

    const retrieveReminders = async () => {
        try {

            const { data } = await axios.get('/api/booking/reminders', {
                params: { remindersID: params.remindersID }
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
        retrieveReminders()
    }, [params.remindersID])

    const updateReminders = async (e: any) => {

        e.preventDefault()

        try {

            const { clientCardID, clientID, meeting_info, supplierID, scheduleID, quantity, note, courseID, name, settlement } = formData

            if (!name) return setErr('Write Name for this booking')

            setIsLoading(true)
            const { data } = await axios.patch('/api/booking/reminders', {
                note, clientCardID, clientID, meeting_info, settlement,
                supplierID, scheduleID, quantity: Number(quantity), courseID,
                name, operator: ADMIN, status: 'pending'
            }, { params: { remindersID: params.remindersID } })

            if (data.ok) {
                setErr('')
                setIsLoading(false)
                router.push('/admin/manage/booking/reminders')
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

    const bookNow = async (e: any) => {

        e.preventDefault()

        try {

            const { clientCardID, clientID, meeting_info, supplierID, scheduleID, quantity, note, courseID, name, settlement } = formData

            if (!name) return setErr('Write Name for this booking')

            setIsLoading(true)
            const res = await axios.patch('/api/booking/reminders', {
                note, clientCardID, clientID, meeting_info, settlement,
                supplierID, scheduleID, quantity: Number(quantity), courseID,
                name, operator: ADMIN, status: 'pending'
            }, { params: { remindersID: params.remindersID } })

            if (res.data.ok) {

                const { data } = await axios.post('/api/booking/reminders/confirm', {
                    remindersID: params.remindersID
                })

                if (data.ok) {
                    setIsLoading(false)
                    alert('Success')
                    router.push('/admin/manage/booking/reminders')
                }

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

    const getSupplierPrice = async () => {
        try {

            const { data } = await axios.get('/api/supplier/price', {
                params: { clientCardID: formData.clientCardID, supplierID: formData.supplierID }
            })

            if (data.ok) setFormData(prevData => ({ ...prevData, price: data.data }))

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
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
            getSupplierPrice()
        }

    }, [formData.clientCardID])

    useEffect(() => {
        setClientCards([])
        getSupplierWithMeeting()
        clearCardCourses()
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

            <AdminSideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.reminders.update')}</h1>
                </nav>
                <div className='w-full px-8 h-full'>
                    {formData.name ? <form onSubmit={updateReminders} className='bg-white w-1/3 h-full border p-10'>

                        {err && <small className='text-red-600 mb-2'>{err}</small>}
                        <div className='flex w-full h-full gap-10'>
                            <div className='flex flex-col w-full gap-4'>


                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="name" className='text-gray-700 font-medium px-3'>{tt('name')}</label>
                                    <input type="text" id='name' name='name' placeholder={tt('name')} value={formData.name} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
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
                                        {supplierSchedule.length > 0 ? supplierSchedule.map(schedule => (
                                            <option value={schedule.id} key={schedule.id}>{schedule.date} ({schedule.time}) {schedule.status === 'reserved' && '(reserved)'}</option>
                                        )) : <option disabled>{t('supplier.select-first')}</option>}
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

                                {formData.status !== 'booked' && permissions?.create_booking && <button disabled={isLoading} onClick={(e: any) => bookNow(e)} type='button' className={`w-full py-2 text-white rounded-md mt-6 ${isLoading ? 'bg-green-500' : 'bg-green-600 hover:bg-green-500'}`}>
                                    {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('booking.confirm')}</button>
                                }

                                <Link href={'/admin/manage/booking/reminders'} className='border w-full py-2 flex items-center justify-center hover:bg-slate-100'>{t('global.cancel')}</Link>

                            </div>
                            <div className='flex flex-col w-full gap-4'>

                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="note" className='text-gray-700 font-medium px-3'>{tt('note')} (optional)</label>
                                    <input type="text" id='note' name='note' placeholder={tt('note')} value={formData.note} onChange={handleChange} className='w-full border px-3 py-1.5 outline-none' />
                                </div>

                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="clientID" className='text-gray-700 font-medium px-3'>{tt('client')}</label>
                                    <select className='px-3 py-1.5 w-full outline-none border' name="clientID" value={formData.clientID} onChange={handleChange} id="clientID">
                                        <option value="">{t('client.select')}</option>
                                        {clientWithCards.length > 0 ? clientWithCards.map(client => (
                                            <option value={client.id} key={client.id}>{client.name}</option>
                                        )) : ''}
                                    </select>
                                </div>

                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="clientCardID" className='text-gray-700 font-medium px-3'>{tt('clientcard')}</label>
                                    <select className='px-3 py-1.5 w-full outline-none border' name="clientCardID" value={formData.clientCardID} onChange={handleChange} id="clientCardID">
                                        <option value="">{t('booking.clientcard-select')}</option>
                                        {clientCards.length > 0 ? clientCards.map(card => (
                                            <option value={card.id} key={card.id}>{card.name} ({card.balance})</option>
                                        )) : <option disabled>{t('client.select-first')}</option>}
                                    </select>
                                </div>

                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="courseID" className='text-gray-700 font-medium px-3'>{tt('course')}</label>
                                    <select className='px-3 py-1.5 w-full outline-none border' name="courseID" value={formData.courseID} onChange={handleChange} id="courseID">
                                        <option value="">{t('booking.select-course')}</option>
                                        {cardCourses && cardCourses.length > 0 ? cardCourses.map(card => (
                                            <option value={card.id} key={card.id}>{card.name}</option>
                                        )) : <option disabled>{t('client-card.select-first')}</option>}
                                    </select>
                                </div>

                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="quantity" className='text-gray-700 font-medium px-3'>{tt('settlement')}</label>
                                    <input type="date" className='w-full px-3 py-1.5 border outline-none' value={formData.settlement} name='settlement' onChange={handleChange} />
                                </div>


                                <div className='flex flex-col gap-2 w-full'>
                                    <label htmlFor="quantity" className='text-gray-700 font-medium px-3'>{tt('quantity')}</label>
                                    <input type="number" className='px-3 py-1 w-full outline-none border' value={formData.quantity} onChange={handleChange} name='quantity' />
                                </div>

                                <button disabled={isLoading} className={`w-full py-2 text-white rounded-md mt-6 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                    {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('booking.reminders.update')}</button>

                            </div>

                        </div>
                    </form> : <div className='w-1/4 h-full grid place-content-center bg-white border'><FontAwesomeIcon icon={faSpinner} width={35} height={35} className='w-[35px] h-[35px] animate-spin' /></div>}
                </div>

            </div>
        </div >
    )

}

export default Page