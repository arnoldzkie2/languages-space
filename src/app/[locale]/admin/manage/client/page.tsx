'use client'
/* eslint-disable react-hooks/exhaustive-deps */
//components
import SideNav from '@/components/super-admin/SideNav';
import ClientTable from '@/components/super-admin/management/client/ClientTable';
import Departments from '@/components/super-admin/management/Departments';
import DeleteClientWarningModal from '@/components/super-admin/management/client/DeleteClientWarningModal';
import ClientModal from '@/components/super-admin/management/client/ClientModal';
import Pagination from '@/components/super-admin/management/Pagination';
import { useEffect, useState, FC } from 'react';
import ClientHeader from '@/components/super-admin/management/client/ClientHeader';
import SearchClient from '@/components/super-admin/management/client/SearchClient';
import useAdminClientStore, { ManageClientSearchQueryValue } from '@/lib/state/super-admin/clientStore';
import useGlobalStore from '@/lib/state/globalStore';
import AdminSideNav from '@/components/admin/AdminSIdeNav';
import AdminClientTable from '@/components/admin/management/client/AdminClientTable';
import AdminClientHeader from '@/components/admin/management/client/AdminClientHeader';

const Page: FC = () => {

    const { departmentID, currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()

    const { totalClients, clients, setTotalClients, selectedClients, deleteModal, viewClientModal, getClients } = useAdminClientStore()

    const [searchQuery, setSearchQuery] = useState(ManageClientSearchQueryValue)

    const filteredClients = clients.filter((client) => {
        const searchName = searchQuery.name.toUpperCase();
        const searchPhone = searchQuery.phone_number.toUpperCase();
        const searchOrganization = searchQuery.organization.toUpperCase();
        const searchOrigin = searchQuery.origin.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase();
        const filterCard = searchQuery.cards;

        if (filterCard) {
            // If filterCard is true, filter based on client.cards.length
            if (client.cards && client.cards.length > 0) {
                return (
                    (searchName === '' || client.name.toUpperCase().includes(searchName)) &&
                    (searchPhone === '' || client.phone_number?.toUpperCase().includes(searchPhone)) &&
                    (searchOrganization === '' || client.organization?.toUpperCase().includes(searchOrganization)) &&
                    (searchOrigin === '' || client.origin?.toUpperCase().includes(searchOrigin)) &&
                    (searchNote === '' || client.note?.toUpperCase().includes(searchNote))
                );
            }
        } else {
            // If filterCard is false, apply other filters without checking client.cards.length
            return (
                (searchName === '' || client.name.toUpperCase().includes(searchName)) &&
                (searchPhone === '' || client.phone_number?.toUpperCase().includes(searchPhone)) &&
                (searchOrganization === '' || client.organization?.toUpperCase().includes(searchOrganization)) &&
                (searchOrigin === '' || client.origin?.toUpperCase().includes(searchOrigin)) &&
                (searchNote === '' || client.note?.toUpperCase().includes(searchNote))
            );
        }
    });

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredClients.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: type === 'checkbox' ? checked : value
        }))
    }

    useEffect(() => {
        getClients()
        setCurrentPage(1)
        setSearchQuery(ManageClientSearchQueryValue)
    }, [departmentID])

    useEffect(() => {
        setTotalClients({
            selected: selectedClients.length.toString(),
            searched: filteredClients.length.toString(),
            total: clients.length.toString()
        })

    }, [clients.length, filteredClients.length, selectedClients.length])

    return (
        <div className='h-screen'>

            <AdminSideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <AdminClientHeader />

                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchClient handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <AdminClientTable filteredTable={currentClients} />

                </div>

                <Pagination totals={totalClients} getTotalPages={getTotalPages} />

            </div>

            {deleteModal && <DeleteClientWarningModal />}
            {viewClientModal && <ClientModal />}

        </div>
    );
};

export default Page;
