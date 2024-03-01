import Err from '@/components/global/Err'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useGlobalStore from '@/lib/state/globalStore'
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Supplier, SupplierBalance, Department } from '@prisma/client'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface SupplierType extends Supplier {
    departments: Department[]
    balance: SupplierBalance[]
}

interface Props {
    supplierID: string
}

const ViewSupplierAlert = ({ supplierID }: Props) => {

    const [open, setOpen] = useState(false)
    const { setIsLoading, setErr } = useGlobalStore()
    const [data, setData] = useState<SupplierType | null>(null)

    const retrieveSupplier = async () => {
        try {
            const { data } = await axios.get('/api/supplier', { params: { supplierID } })

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
        if (open) retrieveSupplier()
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
                    <AlertDialogTitle>{t("supplier.view")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                    {data ? <div className='font-bold text-sm flex flex-col gap-4 p-3 text-muted-foreground'>

                        <div className='flex gap-5'>
                            <Image width={130} height={130} src={data.profile_url || '/profile/profile.svg'} alt='Profile' className='rounded-full bg-card min-w-[130px] min-h-[130px] max-w-[130px] max-h-[130px]' />
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex flex-col gap-1'>
                                    <Label htmlFor='ID'>ID</Label>
                                    <Input readOnly value={data.id} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <Label htmlFor='username'>{t('info.username')}</Label>
                                    <Input readOnly value={data.username} />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='name'>{t('info.name')}</Label>
                            <Input readOnly value={data.name || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='email'>{t("info.email.h1")}</Label>
                            <Input readOnly value={data.email || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='password'>{t('info.password')}</Label>
                            <Input readOnly value={data.password} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='origin'>{t('info.origin')}</Label>
                            <Input readOnly value={data.origin || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='organization'>{t('info.organization')}</Label>
                            <Input readOnly value={data.organization || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='note'>{t('info.note')}:</Label>
                            <div>{data.note}</div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='gender'>{t('info.gender.h1')}</Label>
                            <Input readOnly value={data.gender || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='date'>{t('info.date.h1')}</Label>
                            <Input readOnly value={new Date(data.created_at).toLocaleString() || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='department'>{t('department.s')}</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('department.all')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {data.departments.map(dept => (
                                            <SelectItem value={dept.id} key={dept.id}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <h1 className='border-b pb-2 text-foreground'>{t("balance.h1")}</h1>
                        <div className='flex w-full items-center gap-5'>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor='booking-rate'>{t('balance.commission.rate')}</Label>
                                <Input readOnly value={Number(data.balance[0].booking_rate)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor='currency'>{t('balance.currency')}</Label>
                                <Input readOnly value={data.balance[0].currency} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor='amount'>{t('balance.amount')}</Label>
                            <Input readOnly value={Number(data.balance[0].amount)} />
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


export default ViewSupplierAlert