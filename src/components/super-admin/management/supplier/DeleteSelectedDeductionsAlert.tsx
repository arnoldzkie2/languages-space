import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useSupplierDeductionStore from '@/lib/state/super-admin/supplierDeductionStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    supplierID: string
}

const DeleteSelectedDeductionsAlert = ({ supplierID }: Props) => {

    const [open, setOpen] = useState(false)
    const { getSupplierDeductions, selectedDeductions, setSelectedDeductions } = useSupplierDeductionStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedAdmins = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const Ids = selectedDeductions.map((supplier) => supplier.id);
            const queryString = Ids.map((id) => `deductionID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/supplier/balance/deductions?${queryString}`)

            if (data.ok) {
                getSupplierDeductions(supplierID)
                setSelectedDeductions([])
                setIsLoading(false)
                toast("Success! deductions deleted.")
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

    if (selectedDeductions.length < 1) return null

    return (
        <div className='p-3 border bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{t("operation.delete_all")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("agent.deduction.delete")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3'>
                        {selectedDeductions.map(deduction => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={deduction.id}>
                                <div>{t("info.id")}: <span className='font-normal text-muted-foreground'>{deduction.id}</span></div>
                                <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{deduction.name}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                        <form onSubmit={deleteSelectedAdmins}>
                            <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedDeductionsAlert