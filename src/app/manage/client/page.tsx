'use client'
import SideNav from '@/components/super-admin/SideNav';
import ClientTable from '@/components/super-admin/management/client/ClientTable';
import Departments from '@/components/super-admin/management/client/Departments';
import axios from 'axios';
import { useEffect, useState, FC } from 'react';
import { ClientsProps, DepartmentsProps, NewClientForm } from '@/components/super-admin/management/client/Types';
import DeleteWarningModal from '@/components/super-admin/management/client/DeleteWarningModal';
import Search from '@/components/super-admin/management/client/Search';
import { ChangeEvent } from 'react';
import Pagination from '@/components/super-admin/management/client/Pagination';
import ClientModal from '@/components/super-admin/management/client/ClientModal';
import NewClient from '@/components/super-admin/management/client/NewClient';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ManageClient: FC = () => {

    const [departments, setDepartments] = useState<DepartmentsProps[]>([])

        , [clients, setClients] = useState<ClientsProps[]>([])

        , [newClient, setNewClient] = useState<boolean>(false)

        , [newClientForm, setNewClientForm] = useState<NewClientForm>({
            name: '',
            user_name: '',
            password: '',
            email: '',
            phone_number: '',
            departments: [],
            note: '',
            origin: '',
            address: '',
            gender: '',
            profile: '',
            organization: ''
        })

        , [departmentID, setDepartmentID] = useState<string>('')

        , [clientData, setClientData] = useState<ClientsProps | undefined>(undefined)

        , [deleteModal, setDeleteModal] = useState<boolean>(false)

        , [operation, setOperation] = useState<boolean>(false)

        , [isOpen, setIsOpen] = useState<boolean>(false)

        , [totalClients, setTotalClients] = useState({
            total: '',
            searched: '',
            selected: ''
        })

        , [clientSelectedID, setClientSelectedID] = useState<string | undefined>('')

        , [viewClientModal, setViewClientModal] = useState<boolean>(false)

        , [selectedClients, setSelectedClients] = useState<ClientsProps[]>([])

        , [searchQuery, setSearchQuery] = useState({
            name: '',
            phone_number: '',
            organization: '',
            origin: '',
        })

        , filteredClients = clients.filter((client) => {
            const searchName = searchQuery.name.toUpperCase();
            const searchPhone = searchQuery.phone_number.toUpperCase();
            const searchOrganization = searchQuery.organization.toUpperCase();
            const searchOrigin = searchQuery.origin.toUpperCase();

            return (
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
                name: '',
                phone_number: '',
                organization: '',
                origin: ''
            })

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])

    useEffect(() => {

        setTotalClients({
            selected: selectedClients.length.toString(),
            searched: filteredClients.length.toString(),
            total: clients.length.toString()
        })

    }, [clients, filteredClients, selectedClients])
    
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

        setNewClient(false)

        setNewClientForm({
            name: '',
            email: '',
            phone_number: '',
            user_name: '',
            password: '',
            departments: [],
            note: '',
            origin: '',
            address: '',
            gender: '',
            profile: '',
            organization: ''
        })

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

    const closeViewModal = () => {

        setClientData(undefined)

        setViewClientModal(false)

    }

    const addNewClient = async (event: any) => {

        event.preventDefault()

        const { user_name, password, name } = newClientForm

        if (user_name.length < 3 || password.length < 3 || name.length < 5) return alert('Name or Password or Username is to short')

        try {

            const { data } = await axios.post('/api/client', newClientForm,)

            console.log(data);

            if (data.success) {

                setNewClient(false)

                setNewClientForm({
                    name: '',
                    email: '',
                    phone_number: '',
                    user_name: '',
                    password: '',
                    departments: [],
                    note: '',
                    origin: '',
                    address: '',
                    gender: '',
                    profile: '',
                    organization: ''
                })

                await getClientsByDepartments()

            }

        } catch (error: any) {

            if (error.response.data.message === 'Username already exist!') {

                return alert('Username already exist')

            }

            console.log(error);

        }

    }

    const downloadTable = () => {

        if(selectedClients.length > 0) {

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedClients);
    
            const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
    
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            const excelData: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            saveAs(excelData, 'clients.xlsx');

        } else {

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(clients);
    
            const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
    
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
            const excelData: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            saveAs(excelData, 'clients.xlsx');

        }

    };

    return (
        <div className='flex bg-slate-50'>

            <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className={`flex flex-col w-full ${isOpen ? 'p-5 gap-5' : 'px-10 py-5'}`}>

                <div className={`border shadow flex items-center py-5 px-10 h-24 gap-5`}>
                    <button className='bg-blue-600 text-white py-2 px-3 rounded-sm shadow hover:bg-opacity-90' onClick={() => setNewClient(true)}>NEW CLIENT</button>
                    <button className='border border-blue-600 py-2 px-3 rounded-sm shadow bg-white text-blue-600 hover:text-white hover:bg-blue-600' onClick={downloadTable}>DOWNLOAD</button>
                </div>

                <div className={`flex w-full h-full ${isOpen ? 'gap-5' : 'gap-10'} items-center`}>

                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <Departments departments={departments} setDepartmentID={setDepartmentID} departmentID={departmentID} />
                        <Search handleSearch={handleSearch} searchQuery={searchQuery} totalClients={totalClients} />
                    </div>

                    <ClientTable
                        viewClient={viewClient}
                        clients={currentClients}
                        deleteWarning={deleteWarning}
                        operation={operation}
                        clientSelectedID={clientSelectedID}
                        handleOperation={handleOperation}
                        closeOperation={closeOperation}
                        setSelectedClients={setSelectedClients}
                        selectedClients={selectedClients}
                    />
                </div>

                <Pagination
                    goToPage={goToPage}
                    totalClients={totalClients}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    getTotalPages={getTotalPages}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage} />

            </div>
            {deleteModal && <DeleteWarningModal clientData={clientData} deleteClient={deleteClient} closeModal={closeModal} />}

            {viewClientModal && <ClientModal departments={departments} clientData={clientData} closeViewModal={closeViewModal} />}

            {newClient && <NewClient newClientForm={newClientForm} setNewClientForm={setNewClientForm} addNewClient={addNewClient} closeModal={closeModal} departments={departments} />}
        </div>
    );
};

export default ManageClient;
