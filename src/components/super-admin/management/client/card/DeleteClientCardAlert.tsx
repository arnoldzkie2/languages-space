import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore'
import { ClientCardProps } from '@/lib/types/super-admin/clientCardType'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    card: ClientCardProps
    clientID: string
}

const DeleteClientCardAlert = ({ card, clientID }: Props) => {

    const [open, setOpen] = useState(false)
    const { getClientCards } = useAdminClientCardStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const unbindCard = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const { data } = await axios.delete('/api/client/card', { params: { clientCardID: card.id } })

            if (data.ok) {
                getClientCards(clientID)
                setIsLoading(false)
                toast("Success! card deleted to client.")
                setOpen(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    const t = useTranslations()
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {t('operation.delete')}
                    <FontAwesomeIcon icon={faTrashCan} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("card.delete")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>{t("info.name")}: <span className='font-normal text-muted-foreground'>{card.id}</span></div>
                        <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{card.name}</span></div>
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                    <form onSubmit={unbindCard}>
                        <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default DeleteClientCardAlert