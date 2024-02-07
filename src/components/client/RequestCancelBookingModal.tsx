'use client'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import React from 'react'
import SubmitButton from '../global/SubmitButton'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Err from '../global/Err'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

interface Props {
    requestCancelBooking: (e: React.FormEvent<Element>) => Promise<void>
}


const RequestCancelBookingModal = ({ requestCancelBooking }: Props) => {

    const { requestCancelBookingModal, requestCancelForm, setRequestCancelForm, closeRequestCancelBookingaModal } = useClientBookingStore()
    const tt = useTranslations('global')
    const t = useTranslations("booking")

    if (!requestCancelBookingModal || !requestCancelForm.bookingID) return null

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center padding backdrop-blur tet bg-opacity-30 z-50'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>{t('request-cancel')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={requestCancelBooking} className='flex flex-col gap-4'>
                        <div className='relative w-full'>
                            <Textarea
                                value={requestCancelForm.note}
                                onChange={(e) => {
                                    const inputText = e.target.value;
                                    if (inputText.length <= 180) {
                                        setRequestCancelForm({ ...requestCancelForm, note: inputText });
                                    } else {
                                        setRequestCancelForm({ ...requestCancelForm, note: inputText.slice(0, 180) });
                                    }
                                }}
                                placeholder={tt("note")}
                            />
                            <small className='absolute bottom-3 right-4 text-muted-foreground'>{requestCancelForm.note.length} / 180</small>
                        </div>

                        <div className='flex w-full items-center gap-10'>
                            <Button type='button' variant={'ghost'} className='w-full' onClick={closeRequestCancelBookingaModal}>{tt('close')}</Button>
                            <SubmitButton msg={tt('submit')} style='w-full' />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default RequestCancelBookingModal