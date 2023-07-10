'use client'
/* eslint-disable react-hooks/exhaustive-deps */
//components
import SideNav from '@/components/super-admin/SideNav';
import ClientTable from '@/components/super-admin/management/client/ClientTable';
import Departments from '@/components/super-admin/management/Departments';
import DeleteWarningModal from '@/components/super-admin/management/client/DeleteClientWarningModal';
import ClientModal from '@/components/super-admin/management/client/ClientModal';
import NewClient from '@/components/super-admin/management/client/NewClient';
import Pagination from '@/components/super-admin/management/Pagination';
import { useEffect, useState, FC, Suspense } from 'react';
import axios from 'axios';
import { setClients, setTotalClients, successNewClient } from '@/lib/redux/ManageClient/ManageClientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import { ManageClientSearchQueryValue } from '@/lib/redux/ManageClient/DefaultValues';
import ClientHeader from '@/components/super-admin/management/client/ClientHeader';
import { setCurrentPage, setDepartments } from '@/lib/redux/GlobalState/GlobalSlice';
import SearchClient from '@/components/super-admin/management/client/SearchClient';
import CreateDepartmentModal from '@/components/super-admin/management/CreateDepartmentModal';

const ManageClient: FC = () => {

    const dispatch = useDispatch()

    const { currentPage, departments, isSideNavOpen, departmentID, isCreatingDepartment } = useSelector((state: RootState) => state.globalState)

    const { viewClientModal, totalClients,
        clients, newClient, newClientForm, method,
        deleteModal, selectedClients
    } = useSelector((state: RootState) => state.manageClient)

    const [searchQuery, setSearchQuery] = useState(ManageClientSearchQueryValue)

    const filteredClients = clients.filter((client) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPhone = searchQuery.phone_number.toUpperCase();
        const searchOrganization = searchQuery.organization.toUpperCase();
        const searchOrigin = searchQuery.origin.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase()

        return (

            (searchName === '' || client.name.toUpperCase().includes(searchName)) &&
            (searchPhone === '' || client.phone_number?.toUpperCase().includes(searchPhone)) &&
            (searchOrganization === '' || client.organization?.toUpperCase().includes(searchOrganization)) &&
            (searchOrigin === '' || client.origin?.toUpperCase().includes(searchOrigin)) &&
            (searchNote === '' || client.note?.toUpperCase().includes(searchNote))

        );
    })

    const itemsPerPage = 10

    const indexOfLastItem = currentPage * itemsPerPage

    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredClients.length / itemsPerPage)

    const getClientsByDepartments = async () => {

        try {

            const { data } = await axios.get(`/api/client${departmentID && `?department=${departmentID}`}`)

            dispatch(setClients(data.data))

        } catch (error) {

            console.log(error);

        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target

        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))

    }

    const addOrUpdateClient = async (event: any) => {

        event.preventDefault()

        const { user_name, password, name } = newClientForm

        if (user_name.length < 1) return alert('Username is to short')

        if (name.length < 1) return alert('Name is to short')

        if (user_name.length > 20) return alert('Username is to long')

        if (name.length > 20) return alert('Name is to long')

        if (password.length < 3) return alert('Password is to short')

        try {
            if (method === 'new') {

                var { data } = await axios.post('/api/client', newClientForm)

            } else {

                var { data } = await axios.patch(`/api/client?id=${newClientForm.id}`, newClientForm)

            }

            if (data.success) {

                dispatch(successNewClient())
                await getClientsByDepartments()

            }

        } catch (error: any) {

            if (error.response.data.message === 'Username already exist!') {
                return alert('Username already exist')
            }

        }
    }

    useEffect(() => {

        if (departments.length > 0) {

            getClientsByDepartments()

        } else {

            getClientsByDepartments()

            dispatch(setCurrentPage(1))

            setSearchQuery(ManageClientSearchQueryValue)

        }

    }, [departmentID])

    useEffect(() => {

        dispatch(setTotalClients({

            selected: selectedClients.length.toString(),

            searched: filteredClients.length.toString(),

            total: clients.length.toString()

        }))

    }, [clients.length, filteredClients.length, selectedClients.length])

    return (
        <div className='flex bg-slate-50'>

            <SideNav />

            <div className={`flex flex-col w-full ${isSideNavOpen ? 'p-5' : 'px-10 py-5'}`}>

                <ClientHeader />

                <div className={`flex w-full h-full ${isSideNavOpen ? 'gap-5' : 'gap-10'} items-center`}>
                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <div className='flex flex-col gap-2'>
                            <div className='font-medium pl-2'>Select Department</div>
                            <Departments />
                        </div>
                        <SearchClient handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <ClientTable filteredTable={currentClients} />

                </div>

                <Pagination total={totalClients} getTotalPages={getTotalPages} />
            </div>

            {deleteModal && <DeleteWarningModal getClientsByDepartments={getClientsByDepartments} />}

            {viewClientModal && <ClientModal />}

            {newClient && <NewClient addOrUpdateClient={addOrUpdateClient} />}

            {isCreatingDepartment && <CreateDepartmentModal />}
        </div>
    );
};

export default ManageClient;
