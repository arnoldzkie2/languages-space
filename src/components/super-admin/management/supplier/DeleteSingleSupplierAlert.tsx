import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { SupplierProps } from '@/lib/types/super-admin/supplierTypes'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    supplier: SupplierProps
}

const DeleteSingleSupplierAlert = ({ supplier }: Props) => {

    const [open, setOpen] = useState(false)
    const { getSupplier } = useAdminSupplierStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSingleSupplier = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const { data } = await axios.delete('/api/supplier', { params: { supplierID: supplier.id } })

            if (data.ok) {
                getSupplier()
                setIsLoading(false)
                toast("Success! supplier deleted.")
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
                    <AlertDialogTitle>{t('supplier.delete')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                        <div>{t("info.id")}: <span className='font-normal text-muted-foreground'>{supplier.id}</span></div>
                        <div>{t('info.username')}: <span className='font-normal text-muted-foreground'>{supplier.username}</span></div>
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                    <form onSubmit={deleteSingleSupplier}>
                        <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default DeleteSingleSupplierAlert