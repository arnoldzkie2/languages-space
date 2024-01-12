/* eslint-disable react/no-unescaped-entities */
'use client'
import useGlobalStore from '@/lib/state/globalStore';
import useAdminAgentStore from '@/lib/state/super-admin/agentStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';

const DeleteAgentModal = () => {

    const { isLoading, setIsLoading, setErr } = useGlobalStore()
    const { getAgents, selectedAgents, agentData, closeDeleteAgentModal, setSelectedAgents } = useAdminAgentStore()

    const deleteSupplier = async () => {

        try {

            setIsLoading(true)

            const supplierIds = selectedAgents.map((agent) => agent.id);
            const queryString = supplierIds.map((id) => `agentID=${encodeURIComponent(id)}`).join('&');

            if (selectedAgents.length > 0) {
                var { data } = await axios.delete(`/api/agent?${queryString}`);
            } else {
                var { data } = await axios.delete(`/api/agent`, {
                    params: {
                        supplierID: agentData?.id
                    }
                })
            }

            if (data.ok) {
                getAgents()
                setIsLoading(false)
                closeDeleteAgentModal()
                setSelectedAgents([])
            }

        } catch (error: any) {
            setIsLoading(false)
            console.error(error)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    const t = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen h-screen z-20 grid place-items-center bg-opacity-50 bg-gray-600 py-16'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col overflow-y-auto h-full gap-3'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this agent?</h1>
                {selectedAgents.length > 0
                    ?
                    selectedAgents.map(supplier => {
                        return (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                                <div>SUPPLIER ID: <span className='font-normal text-gray-700'>{supplier.id}</span></div>
                                <div>NAME: <span className='font-normal text-gray-700'>{supplier.name}</span></div>
                            </div>
                        )
                    })
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>SUPPLIER ID: <span className='font-normal text-gray-700'>{agentData?.id}</span></div>
                        <div>NAME: <span className='font-normal text-gray-700'>{agentData?.name}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-center mt-5 gap-5'>
                    <button className='text-sm border w-full py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteAgentModal()}>{t('global.confirm-cancel')}</button>
                    <button onClick={() => deleteSupplier()} disabled={isLoading} className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('global.delete-confirm')}</button>
                </div>
            </div>
        </div >
    );
};

export default DeleteAgentModal;
