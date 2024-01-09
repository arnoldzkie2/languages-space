'use client'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import React from 'react'
import SubmitButton from '../global/SubmitButton'
import { useTranslations } from 'next-intl'

interface Props {
    requestCancelBooking: (e: React.FormEvent<Element>) => Promise<void>
}


const RequestCancelBookingModal = ({ requestCancelBooking }: Props) => {

    const { requestCancelBookingModal, requestCancelForm, setRequestCancelForm, closeRequestCancelBookingaModal } = useClientBookingStore()
    const tt = useTranslations('global')
    const t = useTranslations("booking")

    if (!requestCancelBookingModal || !requestCancelForm.bookingID) return null

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center padding bg-black bg-opacity-30 z-50'>
            <form onSubmit={requestCancelBooking} className='bg-white p-10 flex flex-col gap-4 shadow-md rounded-md'>
                <h1 className='text-center text-xl text-slate-700'>{t('request-cancel')}</h1>
                <div className='relative w-full'>
                    <textarea
                        value={requestCancelForm.note}
                        onChange={(e) => {
                            const inputText = e.target.value;
                            if (inputText.length <= 180) {
                                setRequestCancelForm({ ...requestCancelForm, note: inputText });
                            } else {
                                setRequestCancelForm({ ...requestCancelForm, note: inputText.slice(0, 180) });
                            }
                        }}
                        className='border p-3 w-full text-slate-600 outline-none min-h-[200px] resize-none rounded-md'
                        placeholder={tt("note")}
                    />
                    <small className='absolute bottom-5 right-5 text-slate-500'>{requestCancelForm.note.length} / 180</small>
                </div>

                <div className='flex w-full items-center gap-10'>
                    <button onClick={closeRequestCancelBookingaModal} type='button' className='border w-full py-1.5 rounded-md text-slate-700 bg-slate-50 hover:bg-slate-100'>{tt('close')}</button>
                    <SubmitButton msg={tt('submit')} style='w-full py-1.5 rounded-md bg-blue-600 text-white' />
                </div>
            </form>
        </div>
    )
}

export default RequestCancelBookingModal