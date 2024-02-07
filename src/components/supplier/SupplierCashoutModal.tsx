'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import axios from 'axios'
import React, { useState } from 'react'
import { useTranslations } from 'use-intl'
import SubmitButton from '../global/SubmitButton'
import Err from '../global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { SUPPLIER } from '@/utils/constants'
import Decimal from 'decimal.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { toast } from 'sonner'

const SupplierCashoutModal = () => {

    const [confirm, setConfirm] = useState(false)
    const { toggleCashout, returnCurrency, balance, setBalance, getTransactions } = useSupplierBalanceStore()

    const { setErr, setOkMsg, setIsLoading } = useGlobalStore()
    const tt = useTranslations('global')

    const requestCashout = async (e: React.FormEvent) => {

        e.preventDefault()
        if (!confirm) return setErr('You must confirm to continue')

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/supplier/balance/transactions', { operator: SUPPLIER })

            if (data.ok) {
                getTransactions()
                if (balance) setBalance({ ...balance, amount: new Decimal(0) })
                setIsLoading(false)
                toast('Success! payment request created.')
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
                    <CardTitle>{tt('request-payment')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={requestCashout} className='w-full sm:w-96 bg-card rounded-md flex flex-col gap-4'>

                        <div className='flex flex-col gap-4'>
                            <div className='w-full flex flex-col gap-1.5'>
                                <Label>{tt('amount')}:</Label>
                                <Input value={`${returnCurrency(balance.currency)}${Number(balance.amount)}`} readOnly />
                            </div>
                            <div className='w-full flex flex-col gap-1.5'>
                                <Label>{tt('payment')}:</Label>
                                <Input value={balance.payment_address} readOnly />
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Label>{tt('confirm')}</Label>
                            <Checkbox
                                checked={confirm}
                                onCheckedChange={() => setConfirm(prev => !prev)}
                            />
                        </div>

                        <div className='flex w-full items-center gap-5'>
                            <Button variant={'ghost'} type='button' onClick={toggleCashout} className='w-full'>{tt('close')}</Button>
                            <SubmitButton msg={tt('submit')} style='w-full' />
                        </div>

                    </form>
                </CardContent>
            </Card>

        </div>
    )
}

export default SupplierCashoutModal