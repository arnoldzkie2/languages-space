/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useAdminCardStore from '@/lib/state/super-admin/cardStore';

interface Props {

}

const DeleteCardWarningModal: React.FC<Props> = () => {

    const { cardData, closeDeleteCardModal, getCards } = useAdminCardStore()

    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const deleteCard = async () => {

        try {

            setIsLoading(true)

            const { data } = await axios.delete(`/api/client/card-list?clientCardID=${cardData?.id}`)

            if (data.ok) {

                setIsLoading(false)

                closeDeleteCardModal()

                getCards()

            }

        } catch (error) {

            setIsLoading(false)

            alert('Something went wrong')

            console.log(error);

        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col gap-3 overflow-y-auto h-3/4 w-1/3'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this card?</h1>

                <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                    <div>CARD ID: <span className='font-normal text-gray-700'>{cardData?.id}</span></div>
                    <div>NAME: <span className='font-normal text-gray-700'>{cardData?.name}</span></div>
                </div>

                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteCardModal()}>No Cancel</button>
                    <button disabled={isLoading} className={`text-sm text-white flex items-center justify-center rounded-lg px-3 py-2 ${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-700'}`} onClick={() => deleteCard()}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : "Yes I'm sure"}</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCardWarningModal;
