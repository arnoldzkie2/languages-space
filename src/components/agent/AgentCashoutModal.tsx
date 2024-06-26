'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import axios from 'axios'
import React, { useState } from 'react'
import { useTranslations } from 'use-intl'
import SubmitButton from '../global/SubmitButton'
import Err from '../global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import useAgentBalanceStore from '@/lib/state/agent/agentBalanceStore'
import { AGENT } from '@/utils/constants'
import Decimal from 'decimal.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
const AgentCashoutModal = () => {

    const [confirm, setConfirm] = useState(false)
    const { returnCurrency, } = useSupplierBalanceStore()
    const { balance, getTransactions, toggleCashout, setBalance } = useAgentBalanceStore()

    const { setErr, setOkMsg, setIsLoading } = useGlobalStore()
    const t = useTranslations()

    const requestCashout = async (e: React.FormEvent) => {

        e.preventDefault()

        try {

            if (!confirm) return setErr('You must confirm to continue')
            if (!balance?.amount) return setErr("Not enough balance to request a payment")
            setIsLoading(true)
            const { data } = await axios.post('/api/agent/balance/transactions', { operator: AGENT })

            if (data.ok) {
                getTransactions()
                if (balance) setBalance({ ...balance, amount: new Decimal(0) })
                setIsLoading(false)
                setOkMsg('Success')
                toggleCashout()
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

    if (!balance) return null

    return (
        <div className='fixed top-0 left-0 w-screen h-screen backdrop-blur bg-opacity-30 flex items-center justify-center padding py-20 z-50'>
            <Card>
                <CardHeader>
                    <CardTitle>{t('balance.payment.request')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={requestCashout} className='w-full sm:w-96 bg-card rounded-md flex flex-col gap-4'>
                        <div className='flex flex-col gap-4'>
                            <div className='w-full flex flex-col gap-1.5'>
                                <Label>{t('balance.amount')}:</Label>
                                <Input value={`${returnCurrency(balance.currency)}${Number(balance.amount)}`} readOnly />
                            </div>
                            <div className='w-full flex flex-col gap-1.5'>
                                <Label>{t('balance.payment.address')}:</Label>
                                <Input value={balance.payment_address} readOnly />
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Label>{t('operation.confirm')}</Label>
                            <Checkbox
                                checked={confirm}
                                onCheckedChange={() => setConfirm(prev => !prev)}
                            />
                        </div>
                        <div className='flex items-center w-full gap-5'>
                            <Button variant={'ghost'} className='w-full' type='button' onClick={toggleCashout}>{t('operation.close')}</Button>
                            <SubmitButton msg={t('operation.submit')} style='w-full' />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AgentCashoutModal