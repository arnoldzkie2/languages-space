/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Pagination from '@/components/super-admin/management/Pagination';
import ClientCardHeader from '@/components/super-admin/management/client-card/ClientCardHeader';
import ClientCardModal from '@/components/super-admin/management/client-card/ClientCardModal';
import ClientCardTable from '@/components/super-admin/management/client-card/ClientCardTable';
import DeleteCardWarningModal from '@/components/super-admin/management/client-card/DeleteCardWarningModal';
import SearchClientCard from '@/components/super-admin/management/client-card/SearchCard';
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ClientCard: React.FC = ({ }) => {

    const { currentPage, isSideNavOpen } = useAdminGlobalStore()

    const { cards, getCards, viewCard, deleteCardModal } = useAdminClientCardStore()

    const [searchQuery, setSearchQuery] = useState({
        name: '',
        validity: '',
        price: '',
    })

    const itemsPerPage = 10

    const filteredCard = cards.filter((card) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPrice = searchQuery.price.toUpperCase();
        const searchValidity = searchQuery.validity.toUpperCase();

        return (

            (searchName === '' || card.name.toUpperCase().includes(searchName)) &&
            (searchPrice === '' || card.price.toString().toUpperCase().includes(searchPrice)) &&
            (searchValidity === '' || card.validity.toUpperCase().includes(searchValidity))
        );
    })

    const indexOfLastItem = currentPage * itemsPerPage

    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentCards = filteredCard.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredCard.length / itemsPerPage)

    const handleSearch = (e: any) => {

        const { name, value } = e.target

        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }
    useEffect(() => {

        getCards()

    }, [])

    return (
        <>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <ClientCardHeader />

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchClientCard handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <ClientCardTable filteredTable={currentCards} />

                </div>

                {viewCard && <ClientCardModal />}
                {deleteCardModal && <DeleteCardWarningModal />}
            </div>
        </>
    )
};

export default ClientCard;


