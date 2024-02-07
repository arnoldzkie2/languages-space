'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { useTranslations } from 'next-intl'
import React from 'react'

const ConfirmPaymentModal = () => {

    const closeConfirmPaymentModal = useSupplierBalanceStore(s => s.closeConfirmPaymentModal)
    const confirmPaymentRequest = useSupplierBalanceStore(s => s.confirmPaymentRequest)
    const singleTransaction = useSupplierBalanceStore(s => s.singleTransaction)

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    if (!singleTransaction) return null
    return (
        <div className='fixed backdrop-blur z-50 top-0 left-0 w-screen h-screen flex items-center justify-center padding'>
            <Card className='w-full sm:w-96'>
                <CardHeader>
                    <CardTitle>{t("supplier.payment.confirmed")}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className='w-full flex flex-col gap-4 relative rounded-md shadow'
                        onSubmit={confirmPaymentRequest}>
                        <div className='flex flex-col gap-1 w-full'>
                            <Label htmlFor="name" className='font-medium'>{tt('name')}</Label>
                            <Input type="text" value={singleTransaction.balance.supplier.name} readOnly />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <Label htmlFor="amount" className='font-medium'>{tt('amount')}</Label>
                            <Input type="text" value={singleTransaction.amount} readOnly />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <Label htmlFor="payment_address" className='font-medium'>{tt('payment')}</Label>
                            <Input type="text" value={singleTransaction.payment_address} readOnly />
                        </div>

                        <div className='flex items-center gap-5'>
                            <Button variant={'ghost'} type='button' onClick={closeConfirmPaymentModal} className='w-full'>{tt('cancel')}</Button>
                            <SubmitButton msg={tt('confirm')} style='w-full' />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ConfirmPaymentModal