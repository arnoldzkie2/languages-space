/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';

interface Props {

}

const DeleteWarningModal: React.FC<Props> = () => {

    const { clientData, selectedClients, closeDeleteModal, setSelectedClients, getClients } = useAdminClientStore()

    const deleteClient = async () => {

        try {

            if (selectedClients.length > 0) {

                const newsIds = selectedClients.map((newsItem) => newsItem.id);

                const queryString = newsIds.map((id) => `id=${encodeURIComponent(id)}`).join('&');

                var { data } = await axios.delete(`/api/client?${queryString}`);

            } else {

                var { data } = await axios.delete(`/api/client?id=${clientData?.id}`)

            }

            if (data) {

                closeDeleteModal()

                getClients()

                setSelectedClients([])

            }

        } catch (error) {

            alert('Something went wrong')

            console.log(error);

        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col gap-3 overflow-y-auto h-3/4 w-3/4'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this user?</h1>
                {selectedClients.length > 0 ?
                    selectedClients.map(client => (
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={client.id}>
                        <div>USER ID: <span className='font-normal text-gray-700'>{client.id}</span></div>
                            <div>NAME: <span className='font-normal text-gray-700'>{client.name}</span></div>
                        </div>
                    ))
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={clientData?.id}>
                    <div>USER ID: <span className='font-normal text-gray-700'>{clientData?.id}</span></div>
                        <div>NAME: <span className='font-normal text-gray-700'>{clientData?.name}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteModal()}>No Cancel</button>
                    <button className='text-sm text-white bg-red-600 rounded-lg px-3 py-2 hover:bg-red-700' onClick={() => deleteClient()}>Yes I'm sure</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteWarningModal;
