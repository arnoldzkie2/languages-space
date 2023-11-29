/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import ClientHeader from '@/components/client/ClientHeader'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { ClientCardList } from '@/lib/types/super-admin/clientCardType'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const session: any = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const [searchQuery, setSearchQery] = useState('')

    const { cards, getCards } = useAdminCardStore()
    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const filterCards = cards.filter(card => card.name.toUpperCase().includes(searchQuery.toUpperCase()))

    useEffect(() => {
        if (session.status === 'authenticated') getCards()
    }, [session])

    const checkoutCard = async (card: ClientCardList) => {

        try {

            setIsLoading(true)
            
            const { data } = await axios.post('/api/stripe/checkout', {
                clientID: session.data.user.id,
                cardID: card.id,
                quantity: 2
            })

            if (data.ok) {
                setIsLoading(false)
                window.location.assign(data.data)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    return (
        <>
            <ClientHeader />
            <div className='padding mt-28 flex flex-col items-center text-slate-600'>
                <div className='w-1/2 bg-white shadow'>
                    <div className='w-full flex flex-col gap-5 p-5'>
                        <div className='w-full relative'>
                            <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-3 top-3 text-slate-600' />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQery(e.target.value)} placeholder='Search Cards' className='py-2 px-3 border w-full outline-none' />
                        </div>
                        <div className='w-full flex gap-10 items-center justify-center flex-wrap'>
                            {filterCards.length > 0 ? filterCards.map(card => (
                                <div className='border shadow w-80 h-40 flex flex-col gap-2 p-5 cursor-pointer hover:bg-slate-100' key={card.id} onClick={() => checkoutCard(card)}>
                                    <h1 className='text-slate-700 border-b pb-2 mb- text-xl font-black uppercase'>{card.name}</h1>
                                    <small className=''>Validity: {card.validity} Days</small>
                                    <div className='w-full flex justify-between mt-auto'>
                                        <div>Balance: <span className='text-blue-600 font-black'>{card.balance}</span></div>
                                        <div>Price: <span className='text-blue-600 font-black'>¥{card.price}</span></div>
                                    </div>
                                </div>
                            ))
                                : ''}
                        </div>

                    </div>
                </div>
            </div>
            {isLoading && <div className='fixed top-0 left-0 z-50 w-screen grid place-items-center h-screen bg-black bg-opacity-20'>
                <div className='bg-white h-32 w-32 flex items-center justify-center rounded-full'>
                    <FontAwesomeIcon icon={faSpinner} width={48} height={48} className='animate-spin text-xl w-12 h-12' />
                </div>
            </div>}
        </>
    )
}

export default Page