/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientCardStore from '@/lib/state/client/clientCardStore'
import useClientStore from '@/lib/state/client/clientStore'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

const ClientCards: React.FC = () => {

    const skeleton = [1, 2, 3]
    const client = useClientStore(s => s.client)
    const setPage = useClientStore(state => state.setPage)
    const cards = useClientCardStore(s => s.cards)
    const getCards = useClientCardStore(s => s.getCards)

    useEffect(() => {

        setPage('cards')
        if (!cards && client?.id) getCards()

    }, [client?.id])

    const t = useTranslations('client')
    const tt = useTranslations('global')

    return (
        <ul className='flex flex-col gap-3 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2 text-muted-foreground'>
            <h1 className='text-foreground border-b mb-1 pb-1 text-lg font-bold'>{t('profile.my-cards')}</h1>
            {cards && cards.length > 0 ? cards.map(card => (
                <div className='border bg-card shadow w-full h-44 flex flex-col gap-2 p-5' key={card.id}>
                    <h1 className=' h-8 border-b text-foreground pb-2 text-xl font-bold uppercase'>{card.name}</h1>
                    <small className='h-5 w-44'>{t('card.validity')}: {card.validity}</small>
                    <small className='h-5 w-56'>{t('card.buy-date')}: {new Date(card.created_at).toLocaleString()}</small>
                    <div className='w-full flex justify-between mt-auto h-8'>
                        <div className='h-7'>{t('card.balance')}: <span className='text-primary font-bold'>{card.balance}</span></div>
                        <Button>{t('header.book-now')}</Button>
                    </div>
                </div>
            )) : cards && cards.length < 1 ? <div className='w-full px-3 py-2'>{tt('no-data')}</div> :
                skeleton.map(item => (
                    <div className='border shadow w-full h-44 flex flex-col gap-2 p-5' key={item}>
                        <Skeleton className=' border-b pb-2 w-44 h-8 rounded-md'></Skeleton>
                        <Skeleton className='h-5 w-44 rounded-md'></Skeleton>
                        <Skeleton className='h-5 w-56 rounded-md'></Skeleton>
                        <div className='w-full flex justify-between mt-auto'>
                            <Skeleton className='w-1/3 h-7 rounded-md'></Skeleton>
                            <Skeleton className='px-5 h-8 rounded-md w-1/3'></Skeleton>
                        </div>
                    </div>
                ))}
        </ul>
    )
}

export default ClientCards