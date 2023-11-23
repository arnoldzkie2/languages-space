/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import BindCardHeader from '@/components/super-admin/management/card/BindCardHeader'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { ClientCardList } from '@/lib/types/super-admin/clientCardType'
import { Client } from '@/lib/types/super-admin/clientType'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const [selectedClient, setSelectedClient] = useState<Client>()
    const [selectedCard, setSelectedCard] = useState<ClientCardList>()

    const [clientSearchQuery, setClientSearchQuery] = useState('')
    const [cardSearchQuery, setCardSearchQuery] = useState('')

    const { clients, getClients } = useAdminClientStore()
    const { isSideNavOpen, departmentID, isLoading, setIsLoading, setDepartmentID } = useAdminGlobalStore()
    const { cards, getCards } = useAdminCardStore()

    const filteredClient = clients.filter(client => client.name.toUpperCase().includes(clientSearchQuery.toUpperCase())).splice(0, 40)
    const filteredCard = cards.filter(card => card.name.toUpperCase().includes(cardSearchQuery.toUpperCase())).splice(0, 40)

    useEffect(() => {

        if (cards.length > 0) {
            getClients()
        } else {
            getClients()
            getCards()
        }

    }, [departmentID])

    const bindCardToUser = async (e: any) => {

        e.preventDefault()

        if (!selectedClient) return alert('Select a Client to bind')
        if (!selectedCard) return alert('Select a Card to bind')

        try {

            setIsLoading(true)

            const { data } = await axios.post('/api/client//card/bind', {
                clientID: selectedClient?.id,
                clientCardID: selectedCard?.id
            })

            if (data.ok) {
                setIsLoading(false)
                alert('Success')
                setSelectedCard(undefined)
                setSelectedClient(undefined)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg === 'client_card_exist') {
                return alert('Client already have this card')
            }
            alert('Something went wrong')
        }
    }

    const t = useTranslations('super-admin')

    useEffect(() => {
        setDepartmentID('')
    }, [])

    return (
        <div>
            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <BindCardHeader />

                <div className='w-full px-8'>

                    <div className='flex flex-col bg-white p-10 w-1/4 border gap-5'>

                        <Departments />

                        <div className='relative w-full'>
                            <input type="text" className='px-2 py-1.5 outline-none border w-full' value={clientSearchQuery} onChange={(e: any) => setClientSearchQuery(e.target.value)} placeholder={t('client.search')} />
                            {clientSearchQuery &&
                                <ul className='w-full bg-white absolute top-8 border max-h-96 overflow-y-auto flex flex-col gap-3 z-20 p-3'>
                                    {clientSearchQuery && filteredClient.length > 0 ? filteredClient.map(client => (
                                        <li key={client.id} onClick={() => {
                                            setSelectedClient(client)
                                            setClientSearchQuery('')
                                        }} className='cursor-pointer text-gray-500 hover:text-black'>{client.name} ({client.user_name})</li>
                                    )) : <li>{t('client.404')}</li>}
                                </ul>}
                        </div>

                        <div className='relative w-full'>
                            <input type="text" className='px-2 py-1.5 outline-none border w-full' value={cardSearchQuery} onChange={(e: any) => setCardSearchQuery(e.target.value)} placeholder={t('client-card.search')} />
                            {cardSearchQuery &&
                                <ul className='w-full bg-white absolute top-8 border max-h-96 overflow-y-auto flex flex-col gap-3 z-20 p-3'>
                                    {cardSearchQuery && filteredCard.length > 0 ? filteredCard.map(card => (
                                        <li key={card.id} onClick={() => {
                                            setSelectedCard(card)
                                            setCardSearchQuery('')
                                        }} className='cursor-pointer text-gray-500 hover:text-black'>{card.name} ({card.price})</li>
                                    )) : <li>{t('client-card.404')}</li>}
                                </ul>}
                        </div>

                        <div className='py-5 w-full flex flex-col gap-4'>
                            <div>{t('client.client')}: {selectedClient?.name && `${selectedClient?.user_name} (${selectedClient?.name})`}</div>
                            <div>{t('client-card.card')}: {selectedCard?.name && `${selectedCard?.name} (${selectedCard?.price})`}</div>
                        </div>

                        <button disabled={isLoading && true} onClick={bindCardToUser} className={`${isLoading ? 'bg-blue-500' :
                            'bg-blue-600 hover:bg-blue-500'} outline-none py-2 w-1/2 self-end text-white rounded-md`}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : t('client.card.bind')}</button>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Page