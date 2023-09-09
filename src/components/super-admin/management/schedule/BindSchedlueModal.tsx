/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'
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

const BindSchedlueModal = () => {

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const [clientCard, setClientCard] = useState<ClientCard[]>([])

    const [cardSelectedID, setCardSelectedID] = useState('')

    const [searchQuery, setSearchQuery] = useState('')

    const { closeBindSchedule, selectedScheduleID, getSchedule, currentDate } = useAdminScheduleStore()

    const [meetingSelectedID, setMeetingSelectedID] = useState('')

    const { clients, getClientsWithCards } = useAdminClientStore()

    const filterClient = clients.filter(client => client.name.toUpperCase().includes(searchQuery.toUpperCase()))

    const { departmentID, isLoading, setIsLoading } = useAdminGlobalStore()

    const { setClientSelectedID, clientSelectedID } = useAdminClientStore()

    const { supplierSelectedID, supplierMeetingInfo, setSupplierMeetingInfo } = useAdminSupplierStore()

    const [formData, setFormData] = useState<{ note: string, meeting_info: { id: any, service: string, meeting_code: string } }>({
        note: '',
        meeting_info: {
            id: '',
            service: '',
            meeting_code: ''
        }
    })

    const selectClient = (clientID: string, clientCard: ClientCard[]) => {

        setClientSelectedID(clientID)
        setClientCard(clientCard)

    }

    const getSupplierMeetingInfo = async () => {

        try {

            const { data } = await axios.get(`/api/supplier/meeting`, {
                params: {
                    supplierID: supplierSelectedID
                }
            })

            if (data.ok) setSupplierMeetingInfo(data.data)

        } catch (error) {

            console.log(error);

            alert('Something went wrong')

        }

    }

    const bookSchedule = async (e: any) => {

        e.preventDefault()

        const { note, meeting_info } = formData

        if (!meeting_info.id) return alert('Select A Meeting Info')
        if (!clientSelectedID) return alert('Select A Client')
        if (!cardSelectedID) return alert('Select a card to use')

        try {

            setIsLoading(true)

            const { data } = await axios.post('/api/booking', {
                scheduleID: selectedScheduleID,
                supplierID: supplierSelectedID,
                clientID: clientSelectedID,
                clientCardID: cardSelectedID,
                note, meeting_info
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

    const deleteSchedule = async (e: any) => {

        e.preventDefault()

        try {

            setIsLoading(true)

            const { data } = await axios.delete('/api/schedule', {
                params: {
                    scheduleID: selectedScheduleID
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

        setCardSelectedID('')

        if (supplierMeetingInfo.length > 0) {

            getClientsWithCards()

        } else {

            getSupplierMeetingInfo()
            getClientsWithCards()

        }

    }, [departmentID, clientSelectedID])

    const t = useTranslations('super-admin')
    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-end bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 shadow-lg flex gap-10 overflow-y-auto w-1/2 h-full relative'>
                <FontAwesomeIcon onClick={() => closeBindSchedule()} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex flex-col gap-4 w-1/2'>
                    <Departments />
                    <input value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} type="text" className='border outline-none py-1.5 px-3' placeholder={t('client.search')} />
                    <ul className='flex flex-col h-4/5 pr-2 gap-3 overflow-y-auto py-2 text-gray-600'>
                        {filterClient.length > 0 ? filterClient.map(item => (
                            <li onClick={() => selectClient(item.id, item.cards)} className={`${clientSelectedID === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'} rounded-md w-full py-1.5 cursor-pointer px-2`} key={item.id}>{item.name} ({item.user_name})</li>
                        )) : skeleton.map(item => (
                            <li key={item} className='bg-slate-200 animate-pulse h-7 rounded-xl w-full'></li>
                        ))}
                    </ul>
                    <select className='py-2 mb-2 border outline-none px-2' value={cardSelectedID} onChange={(e: any) => setCardSelectedID(e.target.value)}>
                        <option value="" disabled>Select Card</option>
                        {clientCard.length > 0 ? clientCard.map(card => (
                            <option value={card.id} key={card.id}>
                                {card.name} ({card.balance})
                            </option>
                        )) : <option disabled>Select Client First.</option>}
                    </select>
                    <h1 className='font-medium px-1'>Select Meeting Service</h1>
                    <ul className='flex flex-col gap-2'>
                        {supplierMeetingInfo.map(info => (
                            <li key={info.id} onClick={() => {
                                setFormData(prevData => ({ ...prevData, meeting_info: info }))
                                setMeetingSelectedID(info.id)
                            }} className={`py-1 px-3 rounded-md cursor-pointer ${meetingSelectedID === info.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'}`}>{info.service}</li>
                        ))}
                    </ul>

                    <input className='py-1.5 px-2 border rounded-md outline-none' type="text" placeholder='Note (optional)' value={formData.note} onChange={(e: any) => setFormData(prevData => ({ ...prevData, note: e.target.value }))} />
                    <div className='flex items-center w-full gap-10'>
                    <button onClick={(e: any) => deleteSchedule(e)} disabled={isLoading} className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Delete Schedule'}</button>
                        <button onClick={(e: any) => bookSchedule(e)} disabled={isLoading} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Confirm Booking'}</button>
                    </div>
                </div>
            </div>
        </div>)
}

export default BindSchedlueModal