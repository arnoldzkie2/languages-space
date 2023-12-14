/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useEffect } from 'react'

const ClientCards: React.FC = () => {

    const skeleton = [1, 2, 3]

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signOut()
        },
    })
    const { cards, getClientCards, client } = useClientStore()
    const { setPage } = useAdminGlobalStore()

    useEffect(() => {

        setPage('cards')
        if (session.status === 'authenticated' && !cards && client?.id) getClientCards()

    }, [session, client?.id])

    const t = useTranslations('client')
    const tt = useTranslations('global')

    return (
        <ul className='flex flex-col gap-3 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2'>
            <h1 className='text-blue-600 border-b mb-1 pb-1 text-lg font-bold'>{t('profile.my-cards')}</h1>
            {cards && cards.length > 0 ? cards.map(card => (
                <div className='border shadow w-full h-44 flex flex-col gap-2 p-5 hover:bg-slate-100' key={card.id}>
                    <h1 className='text-slate-700 h-8 border-b pb-2 text-xl font-bold uppercase'>{card.name}</h1>
                    <small className='h-5 w-44'>{t('card.validity')}: {card.validity}</small>
                    <small className='h-5 w-56'>{t('card.buy-date')}: {new Date(card.created_at).toLocaleString()}</small>
                    <div className='w-full flex justify-between mt-auto h-8'>
                        <div className='h-7'>{t('card.balance')}: <span className='text-blue-600 font-bold'>{card.balance}</span></div>
                        <Link href={'/client/booking'} className='px-5 justify-center h-full flex items-center bg-blue-600 hover:bg-blue-500 rounded-md text-white'>{t('header.book-now')}</Link>
                    </div>
                </div>
            )) : cards && cards.length < 1 ? <div className='w-full px-3 py-2'>{tt('no-data')}</div> :
                skeleton.map(item => (
                    <div className='border shadow w-full h-44 flex flex-col gap-2 p-5' key={item}>
                        <h1 className='text-slate-700 border-b pb-2 w-44 h-8 bg-slate-200 animate-pulse rounded-md'></h1>
                        <div className='h-5 w-44 bg-slate-200 animate-pulse rounded-md'></div>
                        <div className='h-5 w-56 bg-slate-200 animate-pulse rounded-md'></div>
                        <div className='w-full flex justify-between mt-auto'>
                            <div className='w-1/3 bg-slate-200 animate-pulse h-7 rounded-md'></div>
                            <div className='px-5 h-8 bg-blue-200 animate-pulse rounded-md w-1/3'></div>
                        </div>
                    </div>
                ))}
        </ul>
    )
}

export default ClientCards