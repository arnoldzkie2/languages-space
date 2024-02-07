/* eslint-disable react/no-unescaped-entities */
'use client'
import Err from '@/components/global/Err';
import SubmitButton from '@/components/global/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';


interface Props {

    getSupplierByDepartments: () => Promise<void>

}

const SupplierDeleteWarningModal: React.FC<Props> = ({ getSupplierByDepartments }) => {

    const { selectedSupplier, supplierData, closeDeleteSupplierModal, setSelectedSupplier } = useAdminSupplierStore()
    const { setIsLoading } = useGlobalStore()

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
                toast("Success! supplier deleted.")
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
        <div className='fixed top-0 left-0 w-screen h-screen z-20 grid place-items-center bg-opacity-50 backdrop-blur py-16'>
            <Card>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this supplier?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>

                    {selectedSupplier.length > 0
                        ?
                        selectedSupplier.map(supplier => {
                            return (
                                <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                                    <div>SUPPLIER ID: <span className='font-normal text-muted-foreground'>{supplier.id}</span></div>
                                    <div>NAME: <span className='font-normal text-muted-foreground'>{supplier.name}</span></div>
                                </div>
                            )
                        })
                        :
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                            <div>SUPPLIER ID: <span className='font-normal text-muted-foreground'>{supplierData?.id}</span></div>
                            <div>NAME: <span className='font-normal text-muted-foreground'>{supplierData?.name}</span></div>
                        </div>
                    }
                    <div className='flex items-center w-full justify-center mt-5 gap-5'>
                        <Button type='button' onClick={closeDeleteSupplierModal} variant={'ghost'} className='w-full'>{t("global.confirm-cancel")}</Button>
                        <SubmitButton msg={t('global.delete-confirm')} variant={'destructive'} style='w-full' onClick={deleteSupplier} />
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default SupplierDeleteWarningModal;
