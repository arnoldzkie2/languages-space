import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteSelectedSupplierAlert = () => {

    const [open, setOpen] = useState(false)
    const { getSupplier, selectedSupplier, setSelectedSupplier } = useAdminSupplierStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedOrders = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const orderIds = selectedSupplier.map((order) => order.id);
            const queryString = orderIds.map((id) => `supplierID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/supplier?${queryString}`)

            if (data.ok) {
                getSupplier()
                setSelectedSupplier([])
                setIsLoading(false)
                toast("Success! news deleted.")
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

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")

    if (selectedSupplier.length < 1) return null

    return (
        <div className='p-3 border bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{tt("delete-all")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("supplier.delete")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3'>
                        {selectedSupplier.map(supplier => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={supplier.id}>
                                <div>ID: <span className='font-normal text-muted-foreground'>{supplier.id}</span></div>
                                <div>{tt('username')}: <span className='font-normal text-muted-foreground'>{supplier.username}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                        <form onSubmit={deleteSelectedOrders}>
                            <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedSupplierAlert