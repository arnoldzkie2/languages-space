/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import axios from 'axios';
import useAdminCardStore from '@/lib/state/super-admin/cardStore';
import useGlobalStore from '@/lib/state/globalStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Err from '@/components/global/Err';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import SubmitButton from '@/components/global/SubmitButton';
import { toast } from 'sonner';

interface Props {

}

const DeleteCardWarningModal: React.FC<Props> = () => {

    const { cardData, closeDeleteCardModal, getCards } = useAdminCardStore()

    const { setIsLoading, setErr } = useGlobalStore()

    const deleteCard = async () => {
        try {

            setIsLoading(true)
            const { data } = await axios.delete(`/api/client/card-list?clientCardID=${cardData?.id}`)

            if (data.ok) {
                toast("Success! card has been deleted")
                setIsLoading(false)
                closeDeleteCardModal()
                getCards()
            }

        } catch (error: any) {
            setIsLoading(false)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
            console.log(error);

        }
    }
    const t = useTranslations("super-admin")
    if (!cardData) return null

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 backdrop-blur'>
            <Card className='w-1/3 h-3/4 overflow-y-auto'>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this card?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-3 w-full'>
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                            <div>CARD ID: <span className='font-normal text-muted-foreground'>{cardData?.id}</span></div>
                            <div>NAME: <span className='font-normal text-muted-foreground'>{cardData?.name}</span></div>
                        </div>

                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button variant={'ghost'} onClick={closeDeleteCardModal}>{t('global.confirm-cancel')}</Button>
                            <SubmitButton msg={t('global.delete-confirm')} variant={'destructive'} onClick={deleteCard} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteCardWarningModal;
