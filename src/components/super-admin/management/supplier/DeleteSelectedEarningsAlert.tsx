import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useSupplierEarningsStore from '@/lib/state/super-admin/supplierEarningStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    supplierID: string
}

const DeleteSelectedEarningsAlert = ({ supplierID }: Props) => {

    const [open, setOpen] = useState(false)
    const { getSupplierEarnings, selectedEarnings, setSelectedEarnings } = useSupplierEarningsStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedEarnings = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const Ids = selectedEarnings.map((supplier) => supplier.id);
            const queryString = Ids.map((id) => `earningsID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/supplier/balance/earnings?${queryString}`)

            if (data.ok) {
                getSupplierEarnings(supplierID)
                setSelectedEarnings([])
                setIsLoading(false)
                toast("Success! earnings deleted.")
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

    if (selectedEarnings.length < 1) return null

    return (
        <div className='p-3 border bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{t("operation.delete_all")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("agent.earning.delete")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3'>
                        {selectedEarnings.map(earnings => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={earnings.id}>
                                <div>{t('info.id')}: <span className='font-normal text-muted-foreground'>{earnings.id}</span></div>
                                <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{earnings.name}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                        <form onSubmit={deleteSelectedEarnings}>
                            <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedEarningsAlert