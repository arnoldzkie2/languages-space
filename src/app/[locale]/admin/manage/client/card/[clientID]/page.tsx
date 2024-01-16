/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav'
import AdminClientHeader from '@/components/admin/management/client/AdminClientHeader'
import AdminClientCardTable from '@/components/admin/management/client/card/AdminClientCardTable'
import SideNav from '@/components/super-admin/SideNav'
import DeleteClientCardWarningModal from '@/components/super-admin/management/card/DeleteClientCardWarningModal'
import SearchClientCard from '@/components/super-admin/management/card/SearchCard'
import ViewClientCardModal from '@/components/super-admin/management/card/ViewClientCardModal'
import ClientHeader from '@/components/super-admin/management/client/ClientHeader'
import ClientCardTable from '@/components/super-admin/management/client/card/ClientCardTable'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore'
import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const { viewClientCard, deleteClientCardModal, clientCardData, closeDeleteClientCardModal, clientCards, getClientCards } = useAdminClientCardStore()

    const { isSideNavOpen, currentPage, itemsPerPage, setIsLoading } = useGlobalStore()

    const [searchQuery, setSearchQuery] = useState({
        name: '',
        validity: '',
        balance: '',
        price: '',
    })

    const filteredCard = clientCards.filter((card) => {

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

    const handleSearch = (e: any) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    const unbindCard = async () => {

        try {
            setIsLoading(true)
            const { data } = await axios.delete(`/api/client/card`, { params: { clientCardID: clientCardData?.id } })

            if (data.ok) {
                getClientCards(params.clientID)
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
        getClientCards(params.clientID)
    }, [])

    return (
        <div className='h-screen'>

            <AdminSideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <AdminClientHeader />
                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchClientCard handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <AdminClientCardTable filteredTable={currentCards} clientID={params.clientID} />
                </div>
            </div>
            {viewClientCard && <ViewClientCardModal />}
            {deleteClientCardModal && <DeleteClientCardWarningModal unbindCard={unbindCard} />}
        </div>
    )
}

export default Page