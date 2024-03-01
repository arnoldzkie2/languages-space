import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminOrderStore from '@/lib/state/super-admin/orderStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteSelectedOrdersAlert = () => {

    const [open, setOpen] = useState(false)
    const { getOrders, selectedOrder, setSelectedOrder } = useAdminOrderStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedOrders = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const orderIds = selectedOrder.map((order) => order.id);
            const queryString = orderIds.map((id) => `orderID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/orders?${queryString}`)

            if (data.ok) {
                getOrders()
                setSelectedOrder([])
                setIsLoading(false)
                toast("Success! orders deleted.")
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

    if (selectedOrder.length < 1) return null

    return (
        <div className='p-3 border bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{t("operation.delete_all")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("order.delete")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3 overflow-y-auto max-h-[500px]'>
                        {selectedOrder.map(order => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={order.id}>
                                <div>{t("info.id")}: <span className='font-normal text-muted-foreground'>{order.id}</span></div>
                                <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{order.name}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                        <form onSubmit={deleteSelectedOrders}>
                            <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedOrdersAlert