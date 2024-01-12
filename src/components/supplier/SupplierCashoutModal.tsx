'use client'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import axios from 'axios'
import React, { useState } from 'react'
import { useTranslations } from 'use-intl'
import SubmitButton from '../global/SubmitButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Err from '../global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { SUPPLIER } from '@/utils/constants'

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
            const { data } = await axios.post('/api/supplier/balance/transactions', {operator: SUPPLIER})

            if (data.ok) {
                getTransactions()
                if (balance) setBalance({ ...balance, amount: 0 })
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
        <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center padding py-20 z-50'>
            <form onSubmit={requestCashout} className='w-full sm:w-96 bg-white rounded-md p-6 flex flex-col gap-4 relative'>
                <h1 className='text-xl mb-2 border-b pb-2 text-slate-700'>{tt('request-payment')}</h1>
                <Err />
                <FontAwesomeIcon icon={faXmark} width={20} height={20} className='absolute right-4 hover:text-blue-600 top-4 text-lg cursor-pointer' onClick={toggleCashout} />
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex items-center gap-2'>
                        <div className='text-slate-500'>{tt('amount')}:</div>
                        <div>{returnCurrency(balance.currency)}{balance.amount}</div>
                    </div>
                    <div className='w-full flex items-center gap-2'>
                        <div className='text-slate-500'>{tt('payment')}:</div>
                        <div>{balance.payment_address}</div>
                    </div>
                </div>
                <div className='flex items-center text-slate-600 gap-4'>
                    <label htmlFor="confirm">{tt('confirm')}</label>
                    <input
                        id='confirm'
                        type="checkbox"
                        checked={confirm}
                        onChange={() => setConfirm((prevConfirm) => !prevConfirm)}
                    />
                </div>

                <SubmitButton msg={tt('submit')} style='w-full py-2 rounded-md bg-blue-600 text-white' />
            </form>
        </div>
    )
}

export default SupplierCashoutModal