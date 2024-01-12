/* eslint-disable react/no-unescaped-entities */
'use client'
import useGlobalStore from '@/lib/state/globalStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';


interface Props {

    getSupplierByDepartments: () => Promise<void>

}

const SupplierDeleteWarningModal: React.FC<Props> = ({ getSupplierByDepartments }) => {

    const { selectedSupplier, supplierData, closeDeleteSupplierModal, setSelectedSupplier } = useAdminSupplierStore()
    const { isLoading, setIsLoading } = useGlobalStore()

    const deleteSupplier = async () => {

        try {

            setIsLoading(true)

            const supplierIds = selectedSupplier.map((supplier) => supplier.id);
            const queryString = supplierIds.map((id) => `supplierID=${encodeURIComponent(id)}`).join('&');

            if (selectedSupplier.length > 0) {
                var { data } = await axios.delete(`/api/supplier?${queryString}`);
            } else {
                var { data } = await axios.delete(`/api/supplier`, {
                    params: {
                        supplierID: supplierData?.id
                    }
                })
            }

            if (data.ok) {
                setIsLoading(false)
                closeDeleteSupplierModal()
                getSupplierByDepartments()
                setSelectedSupplier([])
            }

        } catch (error) {
            setIsLoading(false)
            alert('Something went wrong')
            console.log(error);
        }
    }

    const t = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen h-screen z-20 grid place-items-center bg-opacity-50 bg-gray-600 py-16'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col overflow-y-auto h-full gap-3'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this supplier?</h1>
                {selectedSupplier.length > 0
                    ?
                    selectedSupplier.map(supplier => {
                        return (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                                <div>SUPPLIER ID: <span className='font-normal text-gray-700'>{supplier.id}</span></div>
                                <div>NAME: <span className='font-normal text-gray-700'>{supplier.name}</span></div>
                            </div>
                        )
                    })
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>SUPPLIER ID: <span className='font-normal text-gray-700'>{supplierData?.id}</span></div>
                        <div>NAME: <span className='font-normal text-gray-700'>{supplierData?.name}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-center mt-5 gap-5'>
                    <button className='text-sm border w-full py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteSupplierModal()}>{t('global.confirm-cancel')}</button>
                    <button onClick={() => deleteSupplier()} disabled={isLoading} className={`${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : t('global.delete-confirm')}</button>
                </div>
            </div>
        </div >
    );
};

export default SupplierDeleteWarningModal;
