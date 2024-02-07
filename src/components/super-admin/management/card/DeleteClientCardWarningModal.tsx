/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Err from '@/components/global/Err';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import SubmitButton from '@/components/global/SubmitButton';

interface Props {
    clientID: string
}

const DeleteClientCardWarningModal: React.FC<Props> = ({ clientID }) => {

    const { clientCardData, closeDeleteClientCardModal, unbindClientCard } = useAdminClientCardStore()
    const tt = useTranslations('global')

    if (!clientCardData) return null

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 backdrop-blur'>
            <Card className='h-3/4 w-1/3'>
                <CardHeader>
                    <CardTitle>Are you sure you want to unbind this card to client?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-3 w-full'>

                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                            <div>CARD ID: <span className='font-normal text-muted-foreground'>{clientCardData?.id}</span></div>
                            <div>NAME: <span className='font-normal text-muted-foreground'>{clientCardData?.name}</span></div>
                        </div>

                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button variant={'ghost'} onClick={closeDeleteClientCardModal}>{tt('cancel')}</Button>
                            <form onSubmit={(e) => unbindClientCard({ e, clientID, clientCardID: clientCardData.id })}>
                                <SubmitButton variant={'destructive'} msg={tt("confirm")} />
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default DeleteClientCardWarningModal;
