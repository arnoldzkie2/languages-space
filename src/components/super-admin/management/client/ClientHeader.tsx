import { newOrUpdateClient } from '@/lib/redux/ManageClient/ManageClientSlice';
import { faAddressCard, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import DownloadTable from '../DownloadTable';
import NewDepartment from '../NewDepartment';

const ClientHeader: React.FC = ({ }) => {

    const dispatch = useDispatch()

    const { clients, selectedClients } = useSelector((state: RootState) => state.manageClient)

    return (
        <nav className={`border shadow flex items-center py-5 px-10 justify-between`}>
            <h1 className='font-bold text-gray-600 text-xl'>MANAGE CLIENT</h1>
            <ul className='flex items-center h-full ml-auto gap-10'>
                <li className='flex items-center text-gray-700 hover:text-blue-600 cursor-pointer gap-1' onClick={() => dispatch(newOrUpdateClient({ type: 'new' }))}>
                    <div>New Client</div>
                    <FontAwesomeIcon icon={faUserPlus} />
                </li>

                <DownloadTable tables={clients} selectedTable={selectedClients} />

                <Link href='/manage/client/card' className='flex items-center gap-1 text-gray-700 hover:text-blue-600 cursor-pointer'>
                    <div>Client Card</div>
                    <FontAwesomeIcon icon={faAddressCard} />
                </Link>
                <li className='flex items-center gap-1 text-gray-700 hover:text-blue-600 cursor-pointer'>
                    <div>Bind Card</div>
                    <FontAwesomeIcon icon={faSquarePlus} />
                </li>
                <NewDepartment />
            </ul>
        </nav>
    );
};

export default ClientHeader;
