'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import React from 'react'
import { useTranslations } from 'use-intl'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore'

const SendPayslipButton = () => {

    const sendSupplierPayslip = useAdminSupplierStore(s => s.sendSupplierPayslips)
    const sendAgentPayslip = useAdminAgentStore(s => s.sendAgentPayslip)

    const sendPayslip = async (e: React.FormEvent) => {
        await Promise.all([
            sendSupplierPayslip(e),
            sendAgentPayslip(e)
        ])
    }

    const tt = useTranslations("global")

    // Get the current day of the month
    const currentDay = new Date().getUTCDate();

    // Conditionally render the SubmitButton only if it's the first day of the month
    const renderSubmitButton = (day: number) => {
        //if today is not the first day of the month return this button
        // if (day !== 1) return <NotFirstDayOfTheMonthButton msg={tt('send-payslip')} title={tt('payslip-notfirstday')} />

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