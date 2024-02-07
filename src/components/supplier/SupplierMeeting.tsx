/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import Err from '../global/Err'
import Success from '../global/Success'
import useSupplierMeetingStore from '@/lib/state/supplier/supplireMeetingStore'
import SubmitButton from '../global/SubmitButton'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const SupplierMeeting: React.FC = () => {

    const supplier = useSupplierStore(state => state.supplier)
    const setPage = useSupplierStore(state => state.setPage)
    const {
        getSupplierMeeting,
        meetingInfo,
        addMoreMeetingInfo,
        removeMeetingInfo,
        updateMeeting,
        handleMeetinInfoChange
    } = useSupplierMeetingStore()

    useEffect(() => {

        setPage('meeting')
        if (supplier && !meetingInfo) getSupplierMeeting()

    }, [supplier])

    const tt = useTranslations('global')

    return (
        <form className='flex flex-col gap-3 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2 text-muted-foreground' onSubmit={updateMeeting}>
            <Err />
            <Success />
            <h1 className='text-foreground border-b mb-1 pb-1 text-lg font-bold'>{tt('meeting')}</h1>
            {meetingInfo && meetingInfo.length > 0 ? meetingInfo.map((info, index) => (
                <div key={index} className='flex flex-col gap-3 w-full p-4 border bg-card'>
                    <Input
                        type="text"
                        required
                        name="service"
                        placeholder={tt('service')}
                        value={info.service}
                        onChange={(e) => handleMeetinInfoChange(e, index)}
                    />
                    <Input
                        type="text"
                        required
                        name="meeting_code"
                        placeholder={tt('meeting-code')}
                        value={info.meeting_code}
                        onChange={(e) => handleMeetinInfoChange(e, index)}
                    />
                    <Button variant={'destructive'} onClick={() => removeMeetingInfo(index)} className='w-1/2 self-end'>{tt('remove')}</Button>
                </div>
            )) : <div>{tt('no-data')}</div>
            }
            <div className='flex items-center gap-10 py-5'>
                <Button variant={'secondary'} className='w-full' onClick={addMoreMeetingInfo}>{tt('add-more')}</Button>
                {/* <button type='button' onClick={addMoreMeetingInfo} className='bg-blue-600 hover:bg-blue-500 py-1.5 rounded-md w-1/2 text-white'>{tt('add-more')}</button> */}
                <SubmitButton msg={tt('update')} style='w-full' />
            </div>
        </form>
    )
}

export default SupplierMeeting