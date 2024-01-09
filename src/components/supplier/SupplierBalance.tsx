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
        updatePaymentInfo
    } = useSupplierBalanceStore()

    useEffect(() => {
        setPage('balance')
        if (!balance && supplier) getBalance()
    }, [supplier])

    const t = useTranslations('client')
    const tt = useTranslations('global')

    if (!balance) return <Skeleton />

    return (
        <div className='flex flex-col gap-5 w-full md:w-3/4 lg:w-1/2 order-1 md:order-2'>
            <div className='flex w-full items-center justify-between pb-2 mb-2 border-b'>
                <h1 className='font-bold w-full text-2xl text-blue-600'>{t('profile.balance')}</h1>
                <Cashout balance={balance} isCashoutAvailable={isCashoutAvailable} toggleCashout={toggleCashout} />
            </div>
            <div className='w-full flex gap-10 flex-col sm:flex-row'>
                <div className='flex flex-col gap-4 w-full sm:w-1/2 md:w-full xl:w-1/2 bg-blue-600 text-white p-5 rounded-xl'>
                    <Success />
                    <h1 className='text-slate-200 text-lg h-7'>{tt('total-balance')}</h1>
                    <div className='flex items-center gap-1 text-2xl h-9'>
                        <div>{returnCurrency(balance.currency)}</div>
                        <div>{balance.amount}</div>
                    </div>
                    <div className='flex w-full items-center text-slate-300 text-xs gap-5 mt-3 pt-5 border-t border-slate-400'>
                        <div onClick={() => setTable('earnings')} className={`cursor-pointer h-6 ${table === 'earnings' ? 'text-white' : 'hover:text-white'}`}>{tt('earnings')}</div>
                        <div onClick={() => setTable('deductions')} className={`cursor-pointer h-6 ${table === 'deductions' ? 'text-white' : 'hover:text-white'}`}>{tt('deductions')}</div>
                        <div onClick={() => setTable('transactions')} className={`cursor-pointer h-6 ${table === 'transactions' ? 'text-white' : 'hover:text-white'}`}>{tt('transactions')}</div>
                    </div>
                </div>
                <form className='flex flex-col gap-4 w-full sm:w-1/2 md:w-full xl:w-1/2 bg-white shadow border p-5 rounded-xl' onSubmit={updatePaymentInfo}>
                    <Err />
                    <h1 className='text-slate-600 text-lg'>{tt('payment')}</h1>
                    <input type="text"
                        className='w-full border rounded-md h-8 px-3 outline-none'
                        value={payment_address}
                        onChange={(e) => setPaymentAddress(e.target.value)} />
                    <div className='flex w-full items-center text-slate-600 text-xs gap-5 mt-3 pt-3 border-t border-slate-400'>
                        <div>{tt('schedule')}: <strong className='text-black'>{balance.payment_schedule}</strong></div>
                        <SubmitButton msg={tt('update')} style='ml-auto bg-blue-600 px-5 py-1.5 rounded-md text-white' />
                    </div>
                </form>
            </div>

            <ShowTable table={table} />
        </div >
    )
}

const Skeleton = () => {

    const t = useTranslations('client')

    return (
        <div className='flex flex-col gap-5 w-full md:w-3/4 lg:w-1/2 order-1 md:order-2'>
            <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-blue-600'>{t('profile.balance')}</h1>
            <div className='w-full flex gap-10 flex-col sm:flex-row'>
                <div className='flex flex-col gap-4 w-full sm:w-1/2 md:w-full xl:w-1/2 bg-blue-600 text-white p-5 rounded-xl'>
                    <h1 className='text-slate-200 text-lg h-7 w-40 bg-slate-200 animate-pulse rounded-2xl'></h1>
                    <div className='flex items-center h-9 bg-slate-100 animate-pulse w-44 rounded-2xl'>
                    </div>
                    <div className='flex w-full text-slate-200 text-xs gap-10 mt-3 pt-3 border-t border-slate-300'>
                        <div className='bg-slate-200 w-56 h-6 animate-pulse rounded-2xl'></div>
                    </div>
                </div>

                <div className='flex flex-col gap-4 w-full sm:w-1/2 md:w-full xl:w-1/2 bg-white shadow border p-5 rounded-xl'>
                    <h1 className='text-slate-200 text-lg h-6 w-40 bg-slate-200 animate-pulse rounded-2xl'></h1>
                    <div className='flex items-center h-6 bg-slate-200 animate-pulse w-full rounded-md'>
                    </div>
                    <div className='flex w-full text-slate-200 text-xs gap-10 mt-3 pt-3 border-t border-slate-300 items-center'>
                        <div className='bg-slate-200 w-56 h-6 animate-pulse rounded-2xl'></div>
                        <div className='bg-slate-200 w-20 ml-auto h-6 animate-pulse rounded-2xl'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Cashout = (props: { balance: SupplierBalance, isCashoutAvailable: (schedule: string) => boolean, toggleCashout: () => void }) => {

    const [result, setResult] = useState(false)

    const tt = useTranslations('global')

    const returnWaitMessage = (schedule: string) => {

        const currentDateTime = new Date()

        const lastDayOfMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0);
        const cashoutStart = new Date(lastDayOfMonth);
        cashoutStart.setHours(21, 0, 0, 0);

        // Set the time for the first day of the next month at 6:00 PM
        const firstDayOfNextMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 1);
        const cashoutEnd = new Date(firstDayOfNextMonth);
        cashoutEnd.setHours(18, 0, 0, 0);

        const atDate = cashoutStart.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        const toDate = cashoutEnd.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        if (schedule === 'weekly') return 'Available again in saturday 9PM to sunday 6PM'
        if (schedule === 'monthly') return `Available again in ${atDate} to ${toDate}`
    }

    useEffect(() => {
        if (props.balance) {
            const result = props.isCashoutAvailable('weekly')
            setResult(result)
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
    }, [props.balance])

    if (!result) return <button title={returnWaitMessage(props.balance.payment_schedule)} className='bg-slate-400 px-5 py-1.5 text-white rounded-md cursor-default ml-auto'>{tt('cashout')}</button>

    return <button onClick={props.toggleCashout} className='bg-blue-600 px-5 py-1.5 text-white rounded-md hover:bg-blue-500 ml-auto'>{tt('cashout')}</button>
}

const ShowTable = ({ table }: { table: string }) => {

    if (table === 'transactions') return <SupplierBalanceTransactions />
    if (table === 'earnings') return <SupplierBalanceEarnings />
    if (table === 'deductions') return <SupplierBalanceDeductions />
    return null
}

export default SupplierBalance