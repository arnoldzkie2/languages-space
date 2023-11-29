/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientHeader from '@/components/client/ClientHeader'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const session: any = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const router = useRouter()

    const [searchQuery, setSearchQery] = useState('')
    const [maxVisibleItems, setMaxVisibleItems] = useState(6);

    const { cards, getCards } = useAdminCardStore()
    const { isLoading, setIsLoading } = useAdminGlobalStore()
    const skeleton = [1, 2, 3, 4,5,6]

    const filterCards = cards.filter(card => card.name.toUpperCase().includes(searchQuery.toUpperCase())).slice(0, maxVisibleItems)

    useEffect(() => {
        if (session.status === 'authenticated') getCards()
    }, [session])

    const checkoutCard = async (e: React.FormEvent<HTMLButtonElement>, cardID: string) => {

        e.preventDefault()

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/stripe/checkout', {
                clientID: session.data.user.id, cardID, quantity: 1
            })

            if (data.ok) {
                setIsLoading(false)
                router.push(data.data)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const t = useTranslations('client')
    const tt = useTranslations('global')

    return (
        <>
            <ClientHeader />
            <div className='padding pt-28 flex flex-col items-center text-slate-600'>
                <div className='w-full flex flex-col gap-5 sm:bg-white sm:p-5 sm:shadow 2xl:w-1/2'>
                    <div className='w-full relative'>
                        <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-3 top-3 text-slate-600' />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQery(e.target.value)} placeholder='Search Cards' className='py-2 px-3 border w-full outline-none' />
                    </div>
                    <div className='w-full flex gap-8 items-center justify-evenly flex-wrap'>
                        {filterCards.length > 0 ? filterCards.map(card => (
                            <div className='shadow w-full sm:w-80 border bg-white h-40 flex flex-col gap-2 p-5' key={card.id}>
                                <h1 className='text-slate-700 border-b pb-2 h-8 text-xl font-black uppercase'>{card.name}</h1>
                                <small className='h-5'>{t('card.validity')}: {card.validity} {t('card.days')}</small>
                                <small className='h-5'>{t('card.balance')}: <span className='font-bold'>{card.balance}</span></small>
                                <div className='w-full flex justify-between mt-auto'>
                                    <div className='text-sm flex items-center gap-4 w-1/2 h-7'>
                                        <div>{t('card.price')}: <span className='text-blue-600 font-bold'>¥{card.price}</span></div>
                                    </div>
                                    <button disabled={isLoading} className={`text-sm w-1/3 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} h-7 text-white rounded-md`} onClick={(e) => checkoutCard(e, card.id)}>{isLoading ?
                                        <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' />
                                        : t('card.buy')}</button>
                                </div>
                            </div>
                        ))
                            : skeleton.map(item => (
                                <div className='border shadow w-full bg-white sm:w-80 h-44 flex flex-col gap-2 p-5' key={item}>
                                    <h1 className='text-slate-700 border-b pb-2 w-44 h-8 bg-slate-200 animate-pulse rounded-md'></h1>
                                    <div className='h-5 w-40 bg-slate-200 animate-pulse rounded-md'></div>
                                    <div className='h-5 w-36 bg-slate-200 animate-pulse rounded-md'></div>
                                    <div className='w-full flex justify-between mt-auto gap-4'>
                                        <div className='w-1/2 bg-slate-200 animate-pulse h-7 rounded-md'></div>
                                        <div className='px-5 h-7 bg-blue-200 animate-pulse rounded-md w-1/3'></div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {cards.length > maxVisibleItems && (
                        <button
                            onClick={() => setMaxVisibleItems((prevState) => prevState + 6)}
                            className='text-blue-600 hover:text-blue-500 cursor-pointer mt-5'
                        >
                            {tt('show-more')}
                        </button>
                    )}

                </div>
            </div>
        </>
    )
}

export default Page