/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark, faSpinner, faS } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FormEvent, useEffect, useState } from 'react'
import Departments from '../Departments'
import { useTranslations } from 'next-intl'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import axios from 'axios'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'

const BindSchedlueModal = () => {

    const [searchClient, setSearchClient] = useState('')
    const { closeBindSchedule, getSchedule, currentDate, deleteSupplierSchedule } = useAdminScheduleStore()
    const { departmentID, isLoading, setIsLoading, setErr } = useGlobalStore()
    const { clients, getClientsWithCards, clientCards, getClientCards } = useAdminClientStore()
    const { supplierMeetingInfo, getCardCourses, getSupplierMeetingInfo, cardCourses, clearCardCourses } = useAdminSupplierStore()
    const { bookingFormData, setBookingFormData } = useAdminBookingStore()

    const filterClient = clients.filter(client => client.username.toUpperCase().includes(searchClient.toUpperCase())).slice(0, 30)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }

    const bookSchedule = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const { note, meetingInfoID, clientCardID, courseID, quantity, settlement, scheduleID, supplierID, clientID } = bookingFormData

        if (!meetingInfoID) return setErr('Select  meeting info')
        if (!clientCardID) return setErr('Select card')
        if (!clientID) return setErr('Select client')
        if (!courseID) return setErr('Select course')
        if (!settlement) return setErr('Settlement is requireqd')
        if (!supplierID || !scheduleID) return setErr('Please reload the page')
        if (quantity < 1) return setErr('Quantity must be greater than 0')

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking', {
                scheduleID, supplierID, clientID, clientCardID,
                meetingInfoID, note, settlement,
                name: "1v1 Class", operator: 'admin',
                status: "pending", quantity,
                courseID
            })

            if (data.ok) {
                setIsLoading(false)
                closeBindSchedule()
                getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
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
        setBookingFormData({
            ...bookingFormData, clientID: '', clientCardID: '', courseID: ''
        })
        getClientsWithCards()
    }, [departmentID])

    useEffect(() => {
        if (bookingFormData.clientCardID) getCardCourses(bookingFormData.clientCardID)
    }, [bookingFormData.clientCardID])

    useEffect(() => {
        if (bookingFormData.supplierID) getSupplierMeetingInfo(bookingFormData.supplierID)
    }, [bookingFormData.supplierID])

    useEffect(() => {
        if (bookingFormData.clientID) {
            setBookingFormData({ ...bookingFormData, clientCardID: '', courseID: '' })
            clearCardCourses()
            getClientCards(bookingFormData.clientID)
        }
    }, [bookingFormData.clientID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='fixed top-0 left-0 w-screen z-50 flex h-screen'>

            <div className='w-full h-full bg-black bg-opacity-40 cursor-pointer' title={tt('close')} onClick={closeBindSchedule}>

            </div>
            <div className='bg-white p-10 shadow-lg flex gap-10 overflow-y-auto w-full h-full relative'>
                <FontAwesomeIcon onClick={() => closeBindSchedule()} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <form className='flex flex-col gap-4 w-1/2' onSubmit={bookSchedule}>
                    <Err />
                    <Departments />
                    <div className='flex flex-col w-full gap-2'>
                        <div className='flex items-center gap-5 justify-between relative w-full'>
                            <label htmlFor="searchClient" className='px-2'>{tt('client')}</label>
                            <small id='searchClient' className='absolute bg-blue-600 right-3 top-3 px-2 rounded-md shadow text-white cursor-default' title={`Result: ${filterClient.length} Client`} >{searchClient && filterClient.length}</small>
                            <input value={searchClient} onChange={(e: any) => setSearchClient(e.target.value)} type="text" className='border w-3/4 outline-none py-1.5 px-3' placeholder={t('client.search')} />
                        </div>
                        <select className='py-1.5 mb-2 border outline-none px-2' name='clientID' value={bookingFormData.clientID} onChange={handleChange}>
                            <option value="" disabled>{t('client.select')}</option>
                            {clients.length > 0 && filterClient.length > 0 ? filterClient.map(client => (
                                <option value={client.id} key={client.id}>
                                    {client.username}
                                </option>
                            )) : searchClient && clients.length < 1 ? <option value="" disabled>{t('client.404')}</option> : <option disabled>{tt('loading')}</option>}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="clientCardID" className='px-2'>{tt('card')}</label>
                        <select className='py-1.5 mb-2 border outline-none px-2' value={bookingFormData.clientCardID} onChange={handleChange} name='clientCardID'>
                            <option value="" disabled>{t('client-card.select')}</option>
                            {clientCards.length > 0 ? clientCards.map(card => (
                                <option value={card.id} key={card.id}>
                                    {card.name} ({card.balance})
                                </option>
                            )) : <option disabled>{t('client.select-first')}</option>}
                        </select>
                    </div>

                    <select name="courseID" className='px-2 py-1.5 outline-none' id="courseID" value={bookingFormData.courseID} onChange={handleChange}>
                        <option value="" disabled>{t('courses.select')}</option>
                        {cardCourses && cardCourses.length > 0 ? cardCourses.map(course => (
                            <option value={course.id} key={course.id}>{course.name}</option>
                        )) : cardCourses && cardCourses.length < 1 && bookingFormData.clientCardID ?
                            <option className='' disabled>This card has 0 supported courses</option> :
                            <option disabled>{t('client-card.select-first')}</option>}
                    </select>

                    <div className='flex flex-col gap-2 w-full'>

                        <label htmlFor='meetingInfoID' className='font-medium px-1'>{tt('meeting')}</label>
                        <select name="meetingInfoID" className='px-2 py-1.5 outline-none' id="meetingInfoID" value={bookingFormData.meetingInfoID} onChange={handleChange}>
                            <option value="" disabled>{t('supplier.select-meeting')}</option>
                            {supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                                <option value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</option>
                            )) : supplierMeetingInfo && supplierMeetingInfo.length < 1 && bookingFormData.clientCardID ?
                                <option className='' disabled>This card has 0 supported courses</option> :
                                <option disabled>{t('supplier.select-first')}</option>}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>

                        <label htmlFor="settlement" className='font-medium px-2 text-gray-700'>{tt('settlement')}</label>
                        <input className='py-1.5 px-3 border rounded-md outline-none'
                            type="date" id='settlement' name='settlement'
                            value={bookingFormData.settlement}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="quantity" className='font-medium px-2 text-gray-700'>{tt('quantity')}</label>
                        <input className='py-1.5 px-3 border rounded-md outline-none'
                            type="text" id='quantity' name='quantity'
                            value={bookingFormData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="note" className='font-medium px-2 text-gray-700'>{tt('note')}</label>
                        <input className='py-1.5 px-3 border rounded-md outline-none'
                            type="text" id='note' name='note'
                            value={bookingFormData.note}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex items-center w-full gap-10'>
                        <button type='button'
                            onClick={(e: React.MouseEvent) => deleteSupplierSchedule(e, bookingFormData.scheduleID)}
                            disabled={isLoading}
                            className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('schedule.delete')}</button>

                        <button disabled={isLoading}
                            className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('booking.confirm')}</button>
                    </div>
                </form>
            </div>
        </div>)
}

export default BindSchedlueModal