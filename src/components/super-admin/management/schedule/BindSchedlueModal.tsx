/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark, faSpinner, faS } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Departments from '../Departments'
import { useTranslations } from 'next-intl'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import axios from 'axios'
import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Courses } from '@/lib/types/super-admin/supplierTypes'

interface FormData {
    note: string
    quantity: number
    courseSelectedID: string
    cardSelectedID: string
    settlement: string
    meetingSelectedID: string
    clientCard: ClientCard[]
    courses: Courses[]
    meeting_info: {
        id: any
        service: string
        meeting_code: string
    }
}

const BindSchedlueModal = () => {

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [searchClient, setSearchClient] = useState('')
    const { closeBindSchedule, selectedScheduleID, getSchedule, currentDate } = useAdminScheduleStore()
    const { departmentID, isLoading, setIsLoading } = useAdminGlobalStore()
    const { setClientSelectedID, clientSelectedID, clients, getClientsWithCards } = useAdminClientStore()
    const { supplierSelectedID, supplierMeetingInfo, setSupplierMeetingInfo } = useAdminSupplierStore()

    const filterClient = clients.filter(client => client.name.toUpperCase().includes(searchClient.toUpperCase()))

    const [formData, setFormData] = useState<FormData>({
        note: '',
        cardSelectedID: '',
        courseSelectedID: '',
        settlement: '',
        meetingSelectedID: '',
        quantity: 1,
        courses: [],
        clientCard: [],
        meeting_info: {
            id: '',
            service: '',
            meeting_code: ''
        }
    })

    const selectClient = (clientID: string, clientCard: ClientCard[]) => {
        setClientSelectedID(clientID)
        setFormData(prevData => ({ ...prevData, clientCard: clientCard }))
    }

    const getSupplierPrice = async () => {
        try {

            const { data } = await axios.get('/api/supplier/price', {
                params: { clientCardID: formData.cardSelectedID, supplierID: supplierSelectedID }
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

    const getSupplierMeetingInfo = async () => {

        try {

            const { data } = await axios.get(`/api/supplier/meeting`, {
                params: { supplierID: supplierSelectedID }
            })
            if (data.ok) setSupplierMeetingInfo(data.data)

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    const getCourses = async () => {

        try {
            const { data } = await axios.get('/api/courses', { params: { cardID: formData.cardSelectedID } })
            if (data.ok) { setFormData(prevData => ({ ...prevData, courses: data.data })) }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {

        if (formData.cardSelectedID) {

            getSupplierPrice()
            getCourses()

        }

    }, [formData.cardSelectedID, supplierSelectedID])

    const bookSchedule = async (e: any) => {

        e.preventDefault()
        const { note, meeting_info, cardSelectedID, courseSelectedID, quantity, settlement } = formData

        if (!meeting_info.id) return alert('Select A Meeting Info')
        if (!clientSelectedID) return alert('Select A Client')
        if (!cardSelectedID) return alert('Select a card to use')
        if (!courseSelectedID) return alert('Choose course')
        if (quantity < 1) return alert('Quantity must be greater than 0')

        try {

            setIsLoading(true)

            const { data } = await axios.post('/api/booking', {
                scheduleID: selectedScheduleID,
                supplierID: supplierSelectedID,
                clientID: clientSelectedID,
                clientCardID: cardSelectedID,
                meeting_info, note, settlement,
                name: "1v1 Class", operator: 'Admin',
                status: "pending", quantity, departmentID,
                courseID: courseSelectedID
            })

            if (data.ok) {

                setIsLoading(false)
                closeBindSchedule()
                setClientSelectedID('')
                getSchedule(supplierSelectedID, currentDate.fromDate, currentDate.toDate)

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

    const deleteSchedule = async (e: any) => {
        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.delete('/api/schedule', {
                params: {
                    scheduleID: selectedScheduleID,
                    type: 'delete'
                }
            })
            if (data.ok) {
                setIsLoading(false)
                closeBindSchedule()
                setClientSelectedID('')
                getSchedule(supplierSelectedID, currentDate.fromDate, currentDate.toDate)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {
        setFormData(prevData => ({ ...prevData, cardSelectedID: '' }))
        getClientsWithCards()
    }, [departmentID])

    useEffect(() => {
        getSupplierMeetingInfo()
    }, [supplierSelectedID])

    useEffect(() => {

        setFormData(prevData => ({ ...prevData, cardSelectedID: '' }))

    }, [clientSelectedID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='fixed top-0 left-0 w-screen z-50 flex h-screen'>

            <div className='w-full h-full bg-black bg-opacity-40 cursor-pointer' title={tt('close')} onClick={closeBindSchedule}>

            </div>
            <div className='bg-white p-10 shadow-lg flex gap-10 overflow-y-auto w-full h-full relative'>
                <FontAwesomeIcon onClick={() => closeBindSchedule()} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex flex-col gap-4 w-1/2'>
                    <Departments />
                    <input value={searchClient} onChange={(e: any) => setSearchClient(e.target.value)} type="text" className='border outline-none py-1.5 px-3' placeholder={t('client.search')} />
                    <ul className='flex flex-col h-4/5 pr-2 gap-3 overflow-y-auto py-2 text-gray-600'>
                        {filterClient.length > 0 ? filterClient.map(item => (
                            <li onClick={() => selectClient(item.id, item.cards)} className={`${clientSelectedID === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'} rounded-md w-full py-1.5 cursor-pointer px-2`} key={item.id}>{item.name} ({item.user_name})</li>
                        )) : skeleton.map(item => (
                            <li key={item} className='bg-slate-200 animate-pulse h-7 rounded-xl w-full'></li>
                        ))}
                    </ul>
                    <select className='py-1.5 mb-2 border outline-none px-2' value={formData.cardSelectedID} onChange={(e) => setFormData(prevData => ({ ...prevData, cardSelectedID: e.target.value }))}>
                        <option value="" disabled>Select Card</option>
                        {formData.clientCard.length > 0 ? formData.clientCard.map(card => (
                            <option value={card.id} key={card.id}>
                                {card.name} ({card.balance})
                            </option>
                        )) : <option disabled>{t('client.select-first')}</option>}
                    </select>

                    <select name="courses" className='px-2 py-1.5 outline-none' id="courses" value={formData.courseSelectedID} onChange={(e) => setFormData(prevData => ({ ...prevData, courseSelectedID: e.target.value }))}>
                        <option value="" disabled>{t('courses.select')}</option>
                        {formData.courses.length > 0 ? formData.courses.map(course => (
                            <option value={course.id} key={course.id}>{course.name}</option>
                        )) : formData.courses.length < 1 && formData.cardSelectedID ? <option className='' disabled>This card has 0 supported courses</option> : <option disabled>{t('client-card.select-first')}</option>}

                    </select>
                    <h1 className='font-medium px-1'>{t('schedule.meeting')}</h1>
                    <ul className='flex flex-col gap-2 max-h-20 min-h-[5rem] overflow-y-auto'>
                        {supplierMeetingInfo.map(info => (
                            <li key={info.id} onClick={() => {
                                setFormData(prevData => ({ ...prevData, meeting_info: info }))
                                setFormData(prevData => ({ ...prevData, meetingSelectedID: info.id }))
                            }} className={`py-1 px-3 rounded-md cursor-pointer ${formData.meetingSelectedID === info.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'}`}>{info.service}</li>
                        ))}
                    </ul>

                    <div className='flex flex-col gap-2 w-full'>

                        <label htmlFor="settlement" className='font-medium px-2 text-gray-700'>{tt('settlement')}</label>
                        <input className='py-1.5 px-3 border rounded-md outline-none'
                            type="date" id='settlement'
                            value={formData.settlement}
                            onChange={(e: any) => setFormData(prevData => ({ ...prevData, settlement: e.target.value }))} />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>

                        <label htmlFor="note" className='font-medium px-2 text-gray-700'>{tt('quantity')}</label>
                        <input className='py-1.5 px-3 border rounded-md outline-none'
                            type="text" id='quantity'
                            value={formData.quantity}
                            onChange={(e: any) => setFormData(prevData => ({ ...prevData, quantity: e.target.value }))} />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>

                        <label htmlFor="note" className='font-medium px-2 text-gray-700'>{tt('note')}</label>
                        <input className='py-1.5 px-3 border rounded-md outline-none'
                            type="text" id='note'
                            value={formData.note}
                            onChange={(e: any) => setFormData(prevData => ({ ...prevData, note: e.target.value }))} />
                    </div>

                    <div className='flex items-center w-full gap-10'>
                        <button onClick={(e: any) => deleteSchedule(e)} disabled={isLoading} className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('schedule.delete')}</button>
                        <button onClick={(e: any) => bookSchedule(e)} disabled={isLoading} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('booking.confirm')}</button>
                    </div>
                </div>
            </div>
        </div>)
}

export default BindSchedlueModal