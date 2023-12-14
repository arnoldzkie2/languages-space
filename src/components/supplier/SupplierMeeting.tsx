/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Err from '../global/Err'
import Success from '../global/Success'

const SupplierMeeting: React.FC = () => {

    const skeleton = [1, 2, 3]

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signOut()
        },
    })

    const { meetingInfo, getSupplierMeeting, supplier, setSupplierMeeting } = useSupplierStore()
    const { setPage, setErr, setIsLoading, isLoading, setOkMsg } = useAdminGlobalStore()

    const addMoreMeetingInfo = () => {
        const updatedMeetingInfo = [...meetingInfo!, { service: '', meeting_code: '' }] as SupplierMeetingInfo[]
        setSupplierMeeting(updatedMeetingInfo)
    }

    const handleMeetinInfoChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number) => {
        const updatedMeetingInfo = [...meetingInfo!]
        const propertyName = event.target.name as keyof typeof updatedMeetingInfo[0];
        updatedMeetingInfo[index][propertyName] = event.target.value;
        setSupplierMeeting(updatedMeetingInfo)
    }

    const removeMeetingInfo = (index: number) => {
        const updatedMeetingInfo = [...meetingInfo!];
        updatedMeetingInfo.splice(index, 1);
        setSupplierMeeting(updatedMeetingInfo)
    };

    const updateMeeting = async (e: React.FormEvent) => {
        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.patch('/api/supplier/meeting', { meetingInfo }, { params: { supplierID: supplier?.id } })

            if (data.ok) {
                getSupplierMeeting()
                setOkMsg('Success')
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

        setPage('meeting')
        if (session.status === 'authenticated' && !meetingInfo && supplier?.id) getSupplierMeeting()

    }, [session, supplier?.id])

    const tt = useTranslations('global')

    return (
        <form className='flex flex-col gap-3 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2' onSubmit={updateMeeting}>
            <Err />
            <Success />
            <h1 className='text-blue-600 border-b mb-1 pb-1 text-lg font-bold'>{tt('meeting')}</h1>
            {meetingInfo && meetingInfo.length > 0 ? meetingInfo.map((info, index) => (
                <div key={index} className='flex flex-col gap-3 w-full p-4 border'>
                    <input
                        type="text"
                        required
                        name="service"
                        placeholder={tt('service')}
                        value={info.service}
                        className='py-1.5 px-2 outline-none border rounded-sm'
                        onChange={(e) => handleMeetinInfoChange(e, index)}
                    />
                    <input
                        type="text"
                        required
                        name="meeting_code"
                        placeholder={tt('meeting-code')}
                        value={info.meeting_code}
                        className='py-1.5 px-2 outline-none border rounded-sm'
                        onChange={(e) => handleMeetinInfoChange(e, index)}
                    />
                    <button type='button' onClick={() => removeMeetingInfo(index)} className='bg-red-500 hover:bg-red-600 w-1/2 self-end text-white py-1.5 rounded-md outline-none'>{tt('remove')}</button>
                </div>
            )) : <div>{tt('no-data')}</div>}
            <div className='flex items-center gap-10 py-5'>
                <button type='button' onClick={addMoreMeetingInfo} className='bg-blue-600 hover:bg-blue-500 py-1.5 rounded-md w-1/2 text-white'>{tt('add-more')}</button>
                <button className='bg-blue-600 hover:bg-blue-500 py-1.5 rounded-md w-1/2 text-white'>{tt('update')}</button>
            </div>
        </form>
    )
}

export default SupplierMeeting