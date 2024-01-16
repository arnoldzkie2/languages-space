/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav';
import AdminCardHeader from '@/components/admin/management/card/AdminCardHeader';
import AdminCardTable from '@/components/admin/management/card/AdminCardTable';
import AdminClientHeader from '@/components/admin/management/client/AdminClientHeader';
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import CardTable from '@/components/super-admin/management/card/CardTable';
import ClientCardHeader from '@/components/super-admin/management/card/ClientCardHeader';
import ClientCardModal from '@/components/super-admin/management/card/ClientCardModal';
import DeleteCardWarningModal from '@/components/super-admin/management/card/DeleteCardWarningModal';
import SearchClientCard from '@/components/super-admin/management/card/SearchCard';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminCardStore from '@/lib/state/super-admin/cardStore';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface Props {
    params: {
        clientID: string
    }
}

const ClientCard: React.FC<Props> = ({ params }) => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const { currentPage, isSideNavOpen, itemsPerPage, departmentID, setDepartmentID } = useGlobalStore()

    const { cards, getCards, viewCard, deleteCardModal, totalCards, setTotalCards } = useAdminCardStore()

    const [searchQuery, setSearchQuery] = useState({
        name: '',
        validity: '',
        price: '',
        balance: ''
    })

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
    }, [departmentID])

    useEffect(() => {

        setTotalCards({
            selected: '',
            searched: filteredCard.length.toString(),
            total: cards.length.toString()
        })

    }, [cards.length, filteredCard.length])

    useEffect(() => {
        setDepartmentID('')
    }, [])


    return (
        <div className='h-screen'>
            <AdminSideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <AdminCardHeader />

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchClientCard handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <AdminCardTable filteredTable={currentCards} />

                </div>

                <Pagination totals={totalCards} getTotalPages={getTotalPages} />

                {viewCard && <ClientCardModal />}
                {deleteCardModal && <DeleteCardWarningModal />}
            </div>
        </div>
    )
};

export default ClientCard;


