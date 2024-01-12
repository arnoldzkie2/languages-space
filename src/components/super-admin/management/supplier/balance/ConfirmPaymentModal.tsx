'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
        <div className='fixed bg-black bg-opacity-30 z-50 top-0 left-0 w-screen h-screen flex items-center justify-center padding'>
            <form
                className='bg-white p-10 w-full sm:w-96 flex flex-col gap-4 relative rounded-md shadow'
                onSubmit={confirmPaymentRequest}>
                <FontAwesomeIcon icon={faXmark} width={16} height={16} className='absolute right-5 top-5 cursor-pointer' onClick={closeConfirmPaymentModal} />
                <h1 className='text-xl text-center text-slate-700'>Are you sure this supplier is paid?</h1>
                <Err />
                <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor="name" className='font-medium'>{tt('name')}</label>
                    <input type="text" value={singleTransaction.balance.supplier.name} readOnly className='border px-3 py-1 rounded-sm outline-none text-slate-600 w-full' />
                </div>
                <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor="amount" className='font-medium'>{tt('amount')}</label>
                    <input type="text" value={singleTransaction.amount} readOnly className='border px-3 py-1 rounded-sm outline-none text-slate-600 w-full' />
                </div>
                <div className='flex flex-col gap-1 w-full'>
                    <label htmlFor="payment_address" className='font-medium'>{tt('payment')}</label>
                    <input type="text" value={singleTransaction.payment_address} readOnly className='border px-3 py-1 rounded-sm outline-none text-slate-600 w-full' />
                </div>

                <div className='flex items-center gap-5'>
                    <button type='button'
                        onClick={closeConfirmPaymentModal}
                        className='w-full border rounded-md py-2 hover:bg-slate-100'>{tt('cancel')}</button>
                    <SubmitButton msg={tt('confirm')} style='bg-blue-600 w-full py-2 rounded-md text-white' />
                </div>
            </form>
        </div>
    )
}

export default ConfirmPaymentModal