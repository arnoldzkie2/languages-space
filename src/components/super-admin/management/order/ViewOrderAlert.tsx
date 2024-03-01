import Err from '@/components/global/Err'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useGlobalStore from '@/lib/state/globalStore'
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Order, Department, Client } from '@prisma/client'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface OrderType extends Order {
    departments: Department
    client: Client
}

interface Props {
    orderID: string
}

const ViewOrderAlert = ({ orderID }: Props) => {

    const [open, setOpen] = useState(false)
    const { setIsLoading, setErr } = useGlobalStore()
    const [data, setData] = useState<OrderType | null>(null)

    const retrieveorder = async () => {
        try {
            const { data } = await axios.get('/api/orders', { params: { orderID } })

            if (data.ok) setData(data.data)

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    useEffect(() => {
        if (open) retrieveorder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const t = useTranslations()
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {t('operation.view')}
                    <FontAwesomeIcon icon={faEye} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("order.view")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                    {data ? <div className='font-bold text-sm flex flex-col gap-4 p-3 text-muted-foreground'>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='name'>{t('info.name')}</Label>
                            <Input readOnly value={data.name || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='client'>{t('side_nav.client')}</Label>
                            <Input readOnly value={data.client.username || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='operator'>{t("info.operator")}</Label>
                            <Input readOnly value={data.operator || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='price'>{t('card.price')}</Label>
                            <Input readOnly value={Number(data.price)} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='quantity'>{t('info.quantity')}</Label>
                            <Input readOnly value={data.quantity || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='status'>{t('status.h1')}</Label>
                            <Input readOnly value={data.status || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='note'>{t('info.note')}:</Label>
                            <div>{data.note}</div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='invoice_number'>{t('card.invoice')}</Label>
                            <Input readOnly value={data.invoice_number || ''} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='express_number'>{t('card.express')}</Label>
                            <Input readOnly value={data.express_number || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='date'>{t('info.date.h1')}</Label>
                            <Input readOnly value={new Date(data.created_at).toLocaleString() || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='departments'>{t('side_nav.department')}</Label>
                            <Input readOnly value={data.departments.name || ''} />
                        </div>

                    </div> : <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' />}
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}


export default ViewOrderAlert