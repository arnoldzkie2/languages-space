/* eslint-disable react/no-unescaped-entities */
'use client'
import Err from '@/components/global/Err';
import SubmitButton from '@/components/global/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminAgentStore from '@/lib/state/super-admin/agentStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';

const DeleteAgentModal = () => {

    const { isLoading, setIsLoading, setErr } = useGlobalStore()
    const { getAgents, selectedAgents, agentData, closeDeleteAgentModal, setSelectedAgents } = useAdminAgentStore()

    const deleteAgent = async (e: React.MouseEvent) => {

        try {
            e.preventDefault()
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
                toast("Success! Agent deleted.")
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
        <div className='fixed top-0 left-0 w-screen h-screen z-20 grid place-items-center bg-opacity-50 backdrop-blur py-16'>
            <Card>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this agent?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col w-full gap-3'>
                        {selectedAgents.length > 0
                            ?
                            selectedAgents.map(supplier => {
                                return (
                                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                                        <div>AGENT ID: <span className='font-normal text-muted-foreground'>{supplier.id}</span></div>
                                        <div>NAME: <span className='font-normal text-muted-foreground'>{supplier.name}</span></div>
                                    </div>
                                )
                            })
                            :
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                                <div>AGENT ID: <span className='font-normal text-muted-foreground'>{agentData?.id}</span></div>
                                <div>NAME: <span className='font-normal text-muted-foreground'>{agentData?.name}</span></div>
                            </div>
                        }
                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button variant={'ghost'} onClick={closeDeleteAgentModal}>{t('global.confirm-cancel')}</Button>
                            <SubmitButton msg={t('global.delete-confirm')} onClick={deleteAgent} variant={'destructive'} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default DeleteAgentModal;
