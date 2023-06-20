/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { RootState } from '@/lib/redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteModal, successDeleteClient } from '@/lib/redux/ManageClient/ManageClientSlice';
import axios from 'axios';

interface Props {

    getClientsByDepartments: () => Promise<void>
    
}

const DeleteWarningModal: React.FC<Props> = ({getClientsByDepartments}) => {

    const { clientData } = useSelector((state: RootState) => state.manageClient)

    const dispatch = useDispatch()

    const deleteClient = async (ID: string | undefined) => {

        try {

            const { data } = await axios.delete(`/api/client?id=${ID}`)

            if (data.success) {

                dispatch(successDeleteClient())
                getClientsByDepartments()

            } else {

                dispatch(successDeleteClient())
                alert('Something went wrong please try again.')

            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this user?</h1>
                <div className='font-bold text-sm flex flex-col gap-2'>
                    <div>USER ID: <span className='font-normal text-gray-700'>{clientData?.id}</span></div>
                    <div>NAME: <span className='font-normal text-gray-700'>{clientData?.name}</span></div>
                </div>
                <div className='flex items-center w-full justify-center mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => dispatch(closeDeleteModal())}>No Cancel</button>
                    <button className='text-sm text-white bg-red-600 rounded-lg px-3 py-2 hover:bg-red-700' onClick={() => deleteClient(clientData?.id)}>Yes I'm sure</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteWarningModal;
