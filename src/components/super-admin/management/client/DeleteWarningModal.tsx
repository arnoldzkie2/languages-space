/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { ClientsProps } from './Types';

interface Props {

    clientData: ClientsProps | undefined

    deleteClient: (ID: string | undefined) => Promise<void>

    closeModal: () => void

}

const DeleteWarningModal: React.FC<Props> = ({ clientData, deleteClient, closeModal }) => {

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this user?</h1>
                    <div className='font-bold text-sm flex flex-col gap-2'>
                        <div>USER ID: <span className='font-normal text-gray-700'>{clientData?.id}</span></div>
                        <div>NAME: <span className='font-normal text-gray-700'>{clientData?.name}</span></div>
                    </div>
                    <div className='flex items-center w-full justify-center mt-5 gap-5'>
                        <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={closeModal}>No Cancel</button>
                        <button className='text-sm text-white bg-red-600 rounded-lg px-3 py-2 hover:bg-red-700' onClick={() => deleteClient(clientData?.id)}>Yes I'm sure</button>
                    </div>
            </div>
        </div>
    );
};

export default DeleteWarningModal;
