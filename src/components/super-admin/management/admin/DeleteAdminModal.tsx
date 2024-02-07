/* eslint-disable react/no-unescaped-entities */
'use client'
import Err from '@/components/global/Err';
import SubmitButton from '@/components/global/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminStore from '@/lib/state/super-admin/adminStore';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';

const DeleteAdminModal = () => {

    const { setIsLoading, setErr } = useGlobalStore()
    const { getAdmins, selectedAdmins, adminData, closeDeleteAdminModal, setSelectedAdmins } = useAdminStore()

    const deleteAgent = async (e: React.MouseEvent) => {

        try {
            e.preventDefault()

            setIsLoading(true)
            const adminIds = selectedAdmins.map((admin) => admin.id);
            const queryString = adminIds.map((id) => `adminID=${encodeURIComponent(id)}`).join('&');

            if (selectedAdmins.length > 0) {
                var { data } = await axios.delete(`/api/admin?${queryString}`);
            } else {
                var { data } = await axios.delete(`/api/admin`, {
                    params: {
                        adminID: adminData?.id
                    }
                })
            }

            if (data.ok) {
                getAdmins()
                toast("Success! admin deleted.")
                setIsLoading(false)
                closeDeleteAdminModal()
                setSelectedAdmins([])
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
        <div className='fixed top-0 left-0 w-screen h-screen z-20 grid place-items-center backdrop-blur py-16'>
            <Card>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this admin?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col overflow-y-auto h-full gap-3'>
                        {selectedAdmins.length > 0
                            ?
                            selectedAdmins.map(supplier => {
                                return (
                                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                                        <div>ADMIN ID: <span className='font-normal text-muted-foreground'>{supplier.id}</span></div>
                                        <div>NAME: <span className='font-normal text-muted-foreground'>{supplier.name}</span></div>
                                    </div>
                                )
                            })
                            :
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                                <div>ADMIN ID: <span className='font-normal text-muted-foreground'>{adminData?.id}</span></div>
                                <div>NAME: <span className='font-normal text-muted-foreground'>{adminData?.name}</span></div>
                            </div>
                        }
                        <div className='flex items-center w-full justify-center mt-5 gap-5'>
                            <Button variant={'ghost'} className='w-full' onClick={closeDeleteAdminModal}>{t('global.confirm-cancel')}</Button>
                            <SubmitButton variant={'destructive'} onClick={deleteAgent} msg={t('global.delete-confirm')} style='w-full' />
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div >
    );
};

export default DeleteAdminModal;
