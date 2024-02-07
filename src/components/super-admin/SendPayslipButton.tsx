'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import React from 'react'
import { useTranslations } from 'use-intl'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface Props {
    sendPayslip: (e: React.FormEvent) => Promise<void>
}


const SendPayslipButton = ({ sendPayslip }: Props) => {

    const tt = useTranslations("global")

    // Get the current day of the month
    const currentDay = new Date().getUTCDate();

    // Conditionally render the SubmitButton only if it's the first day of the month
    const renderSubmitButton = (day: number) => {
        //if today is not the first day of the month return this button
        if (day !== 1) return <NotFirstDayOfTheMonthButton msg={tt('send-payslip')} title={tt('payslip-notfirstday')} />
        //else return this button
        return <SubmitButton msg={tt('send-payslip')} />
    }

    return (
        <form onSubmit={sendPayslip} className='flex w-full flex-col gap-2'>
            <Err />
            {renderSubmitButton(currentDay)}
        </form>
    )
}

const NotFirstDayOfTheMonthButton = ({ msg, title }: { msg: string, title: string }) => {
    return (
        <Button title={title} onClick={() => toast(title)} variant={'secondary'} type='button'>
            {msg}
        </Button>
    )
}

export default SendPayslipButton;