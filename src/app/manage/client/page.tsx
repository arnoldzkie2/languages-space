'use client'
import SideNav from '@/components/super-admin/SideNav';
import ClientTable from '@/components/super-admin/management/client/ClientTable';
import Departments from '@/components/super-admin/management/client/Departments';
import axios from 'axios';
import { useEffect, useState, FC } from 'react';
import { ClientsProps, DepartmentsProps } from '@/components/super-admin/management/client/Types';
import DeleteWarningModal from '@/components/super-admin/management/client/DeleteWarningModal';
import Search from '@/components/super-admin/management/client/Search';
import { ChangeEvent } from 'react';
import Pagination from '@/components/super-admin/management/client/Pagination';
import ClientModal from '@/components/super-admin/management/client/ClientModal';


const Client: FC = () => {




    const [departments, setDepartments] = useState<DepartmentsProps[]>([])

        , [clients, setClients] = useState<ClientsProps[]>([])

        , [departmentID, setDepartmentID] = useState<string>('')

        , [clientData, setClientData] = useState<ClientsProps | undefined>(undefined)

        , [deleteModal, setDeleteModal] = useState<boolean>(false)

        , [operation, setOperation] = useState<boolean>(false)

        , [isOpen, setIsOpen] = useState<boolean>(false)

        , [clientSelectedID, setClientSelectedID] = useState<string | undefined>('')

        , [viewClientModal, setViewClientModal] = useState<boolean>(false)

        , [searchQuery, setSearchQuery] = useState({
            id: '',
            name: '',
            phone_number: '',
            organization: '',
            origin: '',
        })

        , filteredClients = clients.filter((client) => {
            const searchID = searchQuery.id.toUpperCase();
            const searchName = searchQuery.name.toUpperCase();
            const searchPhone = searchQuery.phone_number.toUpperCase();
            const searchOrganization = searchQuery.organization.toUpperCase();
            const searchOrigin = searchQuery.origin.toUpperCase();

            return (
                (searchID === '' || client.id.toUpperCase().includes(searchID)) &&
                (searchName === '' || client.name.toUpperCase().includes(searchName)) &&
                (searchPhone === '' || client.phone_number?.toUpperCase().includes(searchPhone)) &&
                (searchOrganization === '' || client.organization?.toUpperCase().includes(searchOrganization)) &&
                (searchOrigin === '' || client.origin?.toUpperCase().includes(searchOrigin))
            );

        })

        , [currentPage, setCurrentPage] = useState(1)

        , itemsPerPage = 10

        , indexOfLastItem = currentPage * itemsPerPage

        , indexOfFirstItem = indexOfLastItem - itemsPerPage

        , currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem)

        , getTotalPages = () => Math.ceil(filteredClients.length / itemsPerPage)

        , goToPreviousPage = () => {

            if (currentPage > 1) {

                setCurrentPage(currentPage - 1);
            }
        }

        , goToNextPage = () => {

            const totalPages = getTotalPages();

            if (currentPage < totalPages) {

                setCurrentPage(currentPage + 1);
            }
        }

        , goToPage = (pageNumber: number) => {
            const totalPages = getTotalPages();
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber);
            }
        }

        , getAllDepartment = async () => {

            try {

                const { data } = await axios.get('/api/department')

                return setDepartments(data.data)

            } catch (error) {
                console.log(error);
            }
        }

        , getClientsByDepartments = async () => {

            try {

                const { data } = await axios.get(`/api/client${departmentID && `?department=${departmentID}`}`)

                setClients(data.data)

            } catch (error) {
                console.log(error);
            }
        }

    useEffect(() => {

        if (departments.length > 0) {

            getClientsByDepartments()

        } else {

            getAllDepartment()

            getClientsByDepartments()

            setCurrentPage(1)

            setSearchQuery({
                id: '',
                name: '',
                phone_number: '',
                organization: '',
                origin: ''
            })

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])


    const deleteClient = async (ID: string | undefined) => {

        try {

            const { data } = await axios.delete(`/api/client?id=${ID}`)

            if (data.success) {

                setDeleteModal(false)

                setClientData(undefined)

                getClientsByDepartments()

                return

            } else {

                setDeleteModal(false)

                setClientData(undefined)

                return alert('Something went wrong please try again.')

            }

        } catch (error) {
            console.log(error);
        }
    }

    const deleteWarning = (client: ClientsProps) => {

        setDeleteModal(true)

        setClientData(client)

        setOperation(false)

        setClientSelectedID('')

    }

    const closeModal = () => {

        setDeleteModal(false)

        setClientData(undefined)

    }

    const handleOperation = (ID: string | undefined) => {

        setClientSelectedID(ID)

        setOperation(true)

    }

    const closeOperation = () => {

        setOperation(false)

        setClientSelectedID('')

    }


    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target

        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))

    }

    const viewClient = async (clientData: ClientsProps) => {

        try {

            setClientData(clientData)

            setViewClientModal(true)

            setOperation(false)

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='flex bg-slate-50'>
            
            <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className='flex flex-col w-full'>
                <div className='h-full bg-gray-300 w-full'>HAHA</div>
                <div className={`flex w-full h-full ${isOpen ? 'p-5 gap-5' : 'p-10 gap-10'} items-start`}>

                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <Departments departments={departments} setDepartmentID={setDepartmentID} departmentID={departmentID} />
                        <Search handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <ClientTable
                        viewClient={viewClient}
                        clients={currentClients}
                        deleteWarning={deleteWarning}
                        operation={operation}
                        clientSelectedID={clientSelectedID}
                        handleOperation={handleOperation}
                        closeOperation={closeOperation}
                    />
                </div>

                <Pagination
                    isOpen={isOpen}
                    goToPage={goToPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    getTotalPages={getTotalPages}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage} />
            </div>
            {deleteModal && <DeleteWarningModal clientData={clientData} deleteClient={deleteClient} closeModal={closeModal} />}
            {viewClientModal && <ClientModal clientData={clientData} />}
        </div>
    );
};

export default Client;
