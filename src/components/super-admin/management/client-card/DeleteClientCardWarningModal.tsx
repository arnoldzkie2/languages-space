/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props {
    unbindCard: () => Promise<void>
}

const DeleteClientCardWarningModal: React.FC<Props> = ({ unbindCard }) => {

    const { clientCardData, closeDeleteClientCardModal } = useAdminClientCardStore()
    const { isLoading } = useAdminGlobalStore()

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col gap-3 overflow-y-auto h-3/4 w-1/3'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this card to client?</h1>

                <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                    <div>CARD ID: <span className='font-normal text-gray-700'>{clientCardData?.id}</span></div>
                    <div>NAME: <span className='font-normal text-gray-700'>{clientCardData?.name}</span></div>
                </div>

                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={closeDeleteClientCardModal}>No Cancel</button>
                    <button disabled={isLoading} className={`text-sm text-white flex items-center justify-center rounded-lg px-3 py-2 ${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-700'}`} onClick={() => unbindCard()}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : "Yes I'm sure"}</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteClientCardWarningModal;
