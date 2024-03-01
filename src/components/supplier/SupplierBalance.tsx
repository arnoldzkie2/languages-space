/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { SupplierBalance } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Success from '../global/Success'
import SupplierBalanceTransactions from './SupplierBalanceTransactions'
import SupplierBalanceEarnings from './SupplierBalanceEarnings'
import SupplierBalanceDeductions from './SupplierBalanceDeductions'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import SubmitButton from '../global/SubmitButton'
import Err from '../global/Err'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { toast } from 'sonner'

const SupplierBalance = () => {

    const [table, setTable] = useState('transactions')

    const { supplier, setPage } = useSupplierStore()
    const {
        balance,
        returnCurrency,
        isCashoutAvailable,
        toggleCashout,
        getBalance,
        setPaymentAddress,
        payment_address,
        updatePaymentInfo,
    } = useSupplierBalanceStore()

    useEffect(() => {
        setPage('balance')
        if (!balance && supplier) getBalance()
    }, [supplier])

    const t = useTranslations()

    if (!balance) return <SkeletonElement />

    return (
        <div className='flex flex-col gap-5 w-full md:w-3/4 lg:w-1/2 order-1 md:order-2 text-muted-foreground'>
            <div className='flex w-full items-center justify-between pb-2 mb-2 border-b'>
                <h1 className='font-bold w-full text-2xl text-foreground'>{t('balance.my_balance')}</h1>
                <ReturnCashoutButton
                    balance={balance}
                    isCashoutAvailable={isCashoutAvailable}
                    toggleCashout={toggleCashout} />
            </div>
            <div className='w-full flex gap-10 flex-col sm:flex-row'>
                <Card className='flex flex-col w-full sm:w-1/2 md:w-full xl:w-1/2 text-foreground'>
                    <CardHeader>
                        <CardTitle>{t('balance.total')}</CardTitle>
                        <CardDescription><Err /></CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col h-full'>
                        <div className='flex items-center gap-1 text-2xl h-9'>
                            <div>{returnCurrency(balance.currency)}</div>
                            <div>{Number(balance.amount)}</div>
                        </div>
                        <div className='flex w-full items-center text-xs gap-5 mt-auto pt-5 border-t text-muted-foreground'>
                            <div onClick={() => setTable('earnings')} className={`cursor-pointer h-6 ${table === 'earnings' ? 'text-primary' : 'hover:text-primary'}`}>{t('balance.earnings.h1')}</div>
                            <div onClick={() => setTable('deductions')} className={`cursor-pointer h-6 ${table === 'deductions' ? 'text-primary' : 'hover:text-primary'}`}>{t('balance.deductions.h1')}</div>
                            <div onClick={() => setTable('transactions')} className={`cursor-pointer h-6 ${table === 'transactions' ? 'text-primary' : 'hover:text-primary'}`}>{t('balance.transactions.h1')}</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className='w-full sm:w-1/2 md:w-full xl:w-1/2'>
                    <CardHeader>
                        <CardTitle>{t("balance.payment.address")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className='flex flex-col gap-4 w-full' onSubmit={updatePaymentInfo}>
                            <Input type="text"
                                value={payment_address}
                                placeholder={t("balance.payment.address")}
                                onChange={(e) => setPaymentAddress(e.target.value)} />
                            <div className='flex w-full items-center text-muted-foreground text-xs gap-2 mt-3 pt-3 border-t'>
                                <div>{t('info.salary')}:</div>
                                <strong className='text-foreground'>{returnCurrency(balance.currency)}{balance.salary}</strong>
                                <SubmitButton msg={t('operation.update')} style='ml-auto' />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <ShowTable table={table} />
        </div >
    )
}

const SkeletonElement = () => {

    const t = useTranslations('client')

    return (
        <div className='flex flex-col gap-5 w-full md:w-3/4 lg:w-1/2 order-1 md:order-2'>
            <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-foreground'>{t('profile.balance')}</h1>
            <div className='w-full flex gap-10 flex-col sm:flex-row'>
                <div className='flex flex-col gap-4 w-full sm:w-1/2 md:w-full xl:w-1/2 bg-card p-5 border rounded-xl'>
                    <Skeleton className='text-lg h-7 w-40 rounded-2xl'></Skeleton>
                    <Skeleton className='flex items-center h-9 w-44 rounded-2xl'>
                    </Skeleton>
                    <div className='flex w-full text-xs gap-10 mt-3 pt-3 border-t'>
                        <Skeleton className='w-56 h-6 rounded-2xl'></Skeleton>
                    </div>
                </div>

                <div className='flex flex-col gap-4 w-full sm:w-1/2 md:w-full xl:w-1/2 bg-card shadow border p-5 rounded-xl'>
                    <Skeleton className='text-lg h-6 w-40 rounded-2xl'></Skeleton>
                    <Skeleton className='flex items-center h-6 w-full rounded-md'>
                    </Skeleton>
                    <div className='flex w-full text-xs gap-10 mt-3 pt-3 border-t items-center'>
                        <Skeleton className='w-56 h-6 rounded-2xl'></Skeleton>
                        <Skeleton className='w-20 ml-auto h-6 rounded-2xl'></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReturnCashoutButton = (props: {
    balance: SupplierBalance,
    isCashoutAvailable: (schedule: string) => boolean,
    toggleCashout: () => void
}) => {

    const [result, setResult] = useState(false)

    const t= useTranslations()

    useEffect(() => {
        if (props.balance) {
            const result = props.isCashoutAvailable('weekly')
            setResult(result)
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
    }, [props.balance])

    // if (!result) return (
    //     <Button variant={'secondary'} onClick={() => toast.error("Payment Request will be available in SATURDAY 9PM - SUNDAY 6PM or Last day of the month 9PM to First day of the month 6PM")}>
    //         {tt('cashout')}
    //     </Button >
    // )

    return (
        <Button onClick={props.toggleCashout}
        >
            {t('balance.cashout.h1')}
        </Button>
    )
}

const ShowTable = ({ table }: { table: string }) => {

    if (table === 'transactions') return <SupplierBalanceTransactions />
    if (table === 'earnings') return <SupplierBalanceEarnings />
    if (table === 'deductions') return <SupplierBalanceDeductions />
    return null
}

export default SupplierBalance