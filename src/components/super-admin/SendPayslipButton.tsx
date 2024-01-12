'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import Success from '@/components/global/Success'
import React from 'react'
import { useTranslations } from 'use-intl'

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
        // if (day !== 11) return <NotFirstDayOfTheMonthButton msg={tt('send-payslip')} title={tt('payslip-notfirstday')} />
        //else return this button
        return <SubmitButton msg={tt('send-payslip')} style='w-full py-1.5 rounded-sm bg-blue-600 text-white' />
    }

    return (
        <form onSubmit={sendPayslip} className='flex w-full flex-col gap-2'>
            <Err />
            <Success />
            {renderSubmitButton(currentDay)}
        </form>
    )
}

const NotFirstDayOfTheMonthButton = ({ msg, title }: { msg: string, title: string }) => {
    return (
        <button
            title={title}
            className='w-full bg-slate-300 rounded-sm py-1.5 cursor-default' disabled>
            {msg}
        </button>
    )
}

export default SendPayslipButton;