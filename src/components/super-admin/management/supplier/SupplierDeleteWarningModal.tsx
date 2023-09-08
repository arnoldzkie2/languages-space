/* eslint-disable react/no-unescaped-entities */
'use client'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import axios from 'axios';
import React from 'react';


interface Props {

    getSupplierByDepartments: () => Promise<void>

}

const SupplierDeleteWarningModal: React.FC<Props> = ({ getSupplierByDepartments }) => {

    const { selectedSupplier, supplierData, closeDeleteSupplierModal, setSelectedSupplier } = useAdminSupplierStore()

    const deleteSupplier = async () => {

        try {

            if (selectedSupplier.length > 0) {

                const supplierIds = selectedSupplier.map((supplier) => supplier.id);

                const queryString = supplierIds.map((id) => `id=${encodeURIComponent(id)}`).join('&');

                var { data } = await axios.delete(`/api/supplier?${queryString}`);

            } else {

                var { data } = await axios.delete(`/api/supplier?id=${supplierData?.id}`)

            }

            if (data) {

                closeDeleteSupplierModal()

                getSupplierByDepartments()

                setSelectedSupplier([])

            }


        } catch (error) {

            alert('Something went wrong')

            console.log(error);

        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-opacity-50 bg-gray-600 py-16'>
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
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeDeleteSupplierModal()}>No Cancel</button>
                    <button className='text-sm text-white bg-red-600 rounded-lg px-3 py-2 hover:bg-red-700' onClick={deleteSupplier}>Yes I'm sure</button>
                </div>
            </div>
        </div >
    );
};

export default SupplierDeleteWarningModal;
