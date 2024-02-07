/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/global/SubmitButton';
import { toast } from 'sonner';

interface Props {

}

const DeleteClientWarningModal: React.FC<Props> = () => {

    const { setIsLoading } = useGlobalStore()

    const { clientData, selectedClients, closeDeleteModal, setSelectedClients, getClients } = useAdminClientStore()

    const deleteClient = async (e: React.FormEvent) => {

        try {
            e.preventDefault()
            setIsLoading(true)
            if (selectedClients.length > 0) {
                const newsIds = selectedClients.map((newsItem) => newsItem.id);
                const queryString = newsIds.map((id) => `clientID=${encodeURIComponent(id)}`).join('&');
                var { data } = await axios.delete(`/api/client?${queryString}`);
            } else {
                var { data } = await axios.delete(`/api/client?clientID=${clientData?.id}`)
            }

            if (data.ok) {
                toast("Success! client deleted.")
                setIsLoading(false)
                closeDeleteModal()
                getClients()
                setSelectedClients([])
            }

        } catch (error) {
            setIsLoading(true)
            alert('Something went wrong')
            console.log(error);
        }
    }

    const tt = useTranslations('global')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 backdrop-blur-sm'>
            <Card className='bg-card p-10 shadow-lg flex flex-col gap-3 overflow-y-auto h-3/4 w-1/2'>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this client?</CardTitle>
                </CardHeader>
                {selectedClients.length > 0 ?
                    selectedClients.map(client => (
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={client.id}>
                            <div>CLIENT ID: <span className='font-normal text-muted-foreground'>{client.id}</span></div>
                            <div>{tt('username')}: <span className='font-normal text-muted-foreground'>{client.username}</span></div>
                        </div>
                    ))
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={clientData?.id}>
                        <div>CLIENT ID: <span className='font-normal text-muted-foreground'>{clientData?.id}</span></div>
                        <div>{tt('username')}: <span className='font-normal text-muted-foreground'>{clientData?.username}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-end mt-5 gap-5'>
                    <Button variant={'ghost'} onClick={closeDeleteModal}>{tt('close')}</Button>
                    <form onSubmit={deleteClient}>
                        <SubmitButton msg={tt('confirm')} variant={'destructive'} />
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default DeleteClientWarningModal;
