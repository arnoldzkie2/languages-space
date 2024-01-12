/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useAgentBalanceStore from '@/lib/state/agent/agentBalanceStore'
import useAgentStore from '@/lib/state/agent/agentStore'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useTranslations } from 'use-intl'

const InviteClient = () => {

    const balance = useAgentBalanceStore(s => s.balance)
    const getBalance = useAgentBalanceStore(s => s.getBalance)
    const agent = useAgentStore(s => s.agent)

    useEffect(() => {

        if (agent && !balance) getBalance()

    }, [agent])

    const copyInvite = (value: string) => {
        navigator.clipboard.writeText(value)
        console.log(value)
        alert("Copied invitation link")
    }

    const tt = useTranslations("global")

    if (!balance) return null

    return (
        <div className='padding py-32 flex items-center flex-col h-screen gap-10'>
            <ReturnComissionMessage
                rate={balance.commission_rate}
                type={balance.commission_type}
                currency={balance.currency} />

            <div className='w-full sm:w-96 md:w-[550px] flex flex-col items-center'>

                <Image
                    width={550}
                    height={550}
                    src={'/agent/invite.png'}
                    alt='Invite a user'
                    className='w-full h-auto'
                />
                <div className='w-3/4 flex items-center relative text-slate-700 hover:text-blue-600' onClick={() => copyInvite(`${process.env.NEXT_PUBLIC_URL}/signup?agent=${agent?.id}`)}>
                    <FontAwesomeIcon icon={faCopy}
                        width={16} height={16}
                        className='absolute right-5 cursor-pointer top-3 bg-white' />
                    <input type="text"
                        readOnly
                        value={`${process.env.NEXT_PUBLIC_URL}/signup?agent=${agent?.id}`}
                        title={tt('copy')}
                        className='w-full border py-2 outline-none px-5 pr-12 cursor-pointer rounded-md shadow'
                    />
                </div>
                <small className='text-slate-600 mt-2'>Invite User!</small>
            </div>
        </div>
    )
}

const ReturnComissionMessage = ({ rate, type, currency }: { rate: number, type: string, currency: string }) => {

    const returnCurrency = useSupplierBalanceStore(s => s.returnCurrency)

    const commissionRate = type === 'fixed' ? `${returnCurrency(currency)}${rate}` : type === 'percentage' ? `${rate}%` : null

    if (!rate || !type) return null

    if (type === 'fixed') {
        return (
            <div className='flex flex-col gap-5 w-full text-center'>
                <div className='flex flex-col'>
                    <h1 className='text-5xl font-extralight text-slate-800 mb-3'>Invite a user, get {commissionRate} for every card they purchase!</h1>
                    <h1 className='text-5xl font-extralight text-slate-800 mb-3'>on every card purchase!</h1>
                </div>
                <div className='flex flex-col'>
                    <h2 className='text-slate-600'>Receive a fixed {commissionRate} commission when your friends buy a card through your invite.</h2>
                    <h2 className='text-slate-600'>Simple and rewarding - {commissionRate} in your pocket with each card sale!.</h2>
                </div>
            </div>
        )
    }

    if (type === 'percentage') {
        return (
            <div className='flex flex-col gap-5 w-full text-center'>
                <div className='flex flex-col'>
                    <h1 className='text-5xl font-extralight text-slate-800 mb-3'>Invite a user, earn {commissionRate} commission</h1>
                    <h1 className='text-5xl font-extralight text-slate-800 mb-3'>on every card purchase!</h1>
                </div>
                <div className='flex flex-col'>
                    <h2 className='text-slate-600'>Your connections, your earnings - {commissionRate} of the card price goes straight to you!</h2>
                    <h2 className='text-slate-600'>Enjoy a {commissionRate} commission each time a user buy a card through your invite.</h2>
                </div>
            </div>
        )
    }

    return null
}

export default InviteClient