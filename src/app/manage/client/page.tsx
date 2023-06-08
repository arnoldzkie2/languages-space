'use client'
import SideNav from '@/components/super-admin/SideNav';
import ClientTable from '@/components/super-admin/management/client/ClientTable';
import Departments from '@/components/super-admin/management/client/Departments';
import axios from 'axios';
import { useEffect, useState, FC } from 'react';
import { ClientsProps, DepartmentsProps } from '@/components/super-admin/management/client/Types';
import DeleteWarningModal from '@/components/super-admin/management/client/DeleteWarningModal';
const Client: FC = () => {

    const [departments, setDepartments] = useState<DepartmentsProps[]>([])

        , [clients, setClients] = useState<ClientsProps[]>([])

        , [departmentID, setDepartmentID] = useState<string>('')

        , [clientData, setClientData] = useState<ClientsProps | undefined>(undefined)

        , [deleteModal, setDeleteModal] = useState<boolean>(false)

        , [operation, setOperation] = useState<boolean>(false)

        , [clientSelectedID, setClientSelectedID] = useState<string | undefined>('')

    const getAllDepartment = async () => {

        try {

            const { data } = await axios.get('/api/department')

            return setDepartments(data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const getClientsByDepartments = async () => {

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


    return (
        <div className='flex items-center'>
            <SideNav />

            <Departments departments={departments} setDepartmentID={setDepartmentID} departmentID={departmentID} />

            <ClientTable
                clients={clients}
                deleteWarning={deleteWarning}
                operation={operation}
                clientSelectedID={clientSelectedID}
                handleOperation={handleOperation}
                closeOperation={closeOperation}
            />

            {deleteModal && <DeleteWarningModal clientData={clientData} deleteClient={deleteClient} closeModal={closeModal} />}
        </div>
    );
};

export default Client;
