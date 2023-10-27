/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import ClientCardTable from '@/components/super-admin/management/client-card/ClientCardTable'
import DeleteClientCardWarningModal from '@/components/super-admin/management/client-card/DeleteClientCardWarningModal'
import SearchClientCard from '@/components/super-admin/management/client-card/SearchCard'
import ViewClientCardModal from '@/components/super-admin/management/client-card/ViewClientCardModal'
import ClientHeader from '@/components/super-admin/management/client/ClientHeader'
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import { Client } from '@/lib/types/super-admin/clientType'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const [client, setClient] = useState<Client>()

    const { viewClientCard, deleteClientCardModal, clientCardData, closeDeleteClientCardModal } = useAdminClientCardStore()

    const { isSideNavOpen, currentPage, itemsPerPage, setIsLoading } = useAdminGlobalStore()

    const [searchQuery, setSearchQuery] = useState({
        name: '',
        validity: '',
        balance: '',
        price: '',
    })

    const filteredCard = client?.cards.filter((card) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPrice = searchQuery.price.toUpperCase();
        const searchBalance = searchQuery.balance.toUpperCase();
        const searchValidity = searchQuery.validity.toUpperCase();

        return (

            (searchName === '' || card.name.toUpperCase().includes(searchName)) &&
            (searchPrice === '' || card.price.toString().toUpperCase().includes(searchPrice)) &&
            (searchBalance === '' || card.balance.toString().toUpperCase().includes(searchBalance)) &&
            (searchValidity === '' || card.validity.toUpperCase().includes(searchValidity))
        );
    }) as ClientCard[]

    const indexOfLastItem = currentPage * itemsPerPage

    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentCards = filteredCard?.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredCard?.length / itemsPerPage)

    const handleSearch = (e: any) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    const getClientCards = async () => {

        try {
            const { data } = await axios.get('/api/client', {
                params: {
                    clientID: params.clientID
                }
            })

            if (data.ok) {
                setClient(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    const unbindCard = async () => {

        try {
            setIsLoading(true)
            const { data } = await axios.delete(`/api/client/card/?cardID=${clientCardData?.id}`)

            if (data.ok) {
                getClientCards()
                setIsLoading(false)
                closeDeleteClientCardModal()
                alert('Success')
            }

        } catch (error) {
            setIsLoading(false)
            alert('Something went wrong')
            console.log(error);
        }
    }

    useEffect(() => {
        getClientCards()
    }, [])

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <ClientHeader />
                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchClientCard handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <ClientCardTable filteredTable={currentCards} clientID={client?.id || ''} />
                </div>
            </div>
            {viewClientCard && <ViewClientCardModal />}
            {deleteClientCardModal && <DeleteClientCardWarningModal unbindCard={unbindCard} />}
        </div>
    )
}

export default Page