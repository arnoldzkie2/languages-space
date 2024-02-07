import Err from '@/components/global/Err'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import useGlobalStore from '@/lib/state/globalStore'
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ClientCardList, Department, Courses, SupplierPrice, Supplier } from '@prisma/client'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface SupplierPriceType extends SupplierPrice {
    supplier: Supplier
}

interface CardType extends ClientCardList {
    departments: Department
    supported_courses: Courses[]
    supported_suppliers: SupplierPriceType[]
}



interface Props {
    cardID: string
}

const ViewCardAlert = ({ cardID }: Props) => {

    const [open, setOpen] = useState(false)
    const { setIsLoading, setErr } = useGlobalStore()
    const [data, setData] = useState<CardType | null>(null)

    const retrieveorder = async () => {
        try {
            const { data } = await axios.get('/api/client/card-list', { params: { cardID } })

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

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {tt('view')}
                    <FontAwesomeIcon icon={faEye} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("client-card.view")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                    {data ? <div className='font-bold text-sm flex flex-col gap-4 p-3 text-muted-foreground'>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='name'>{tt('name')}</Label>
                            <Input readOnly value={data.name || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='sold'>{t('client-card.sold')}</Label>
                            <Input readOnly value={data.sold || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='price'>{tt("price")}</Label>
                            <Input readOnly value={Number(data.price) || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='price'>{tt('price')}</Label>
                            <Input readOnly value={Number(data.price)} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='balance'>{tt('balance')}</Label>
                            <Input readOnly value={data.balance || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='validity'>{t('client-card.validity')}</Label>
                            <Input readOnly value={data.validity || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='sold'>{t('client-card.sold')}</Label>
                            <Input readOnly value={data.sold || ''} />
                        </div>

                        <div className="flex items-center gap-10">
                            <div className="flex flex-col gap-2">
                                <div className='flex items-center gap-2'>
                                    <Switch checked={data.repeat_purchases} />
                                    <Label htmlFor='repeat_purchases'>{t('client-card.repeat_purchases')}</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Switch checked={data.online_renews} />
                                    <Label htmlFor='online_renews'>{t('client-card.online_renews')}</Label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">

                                <div className='flex items-center gap-2'>
                                    <Switch checked={data.prepaid} />
                                    <Label htmlFor='prepaid'>{t('client-card.prepaid')}</Label>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <Switch checked={data.available} />
                                    <Label htmlFor='available'>{t('client-card.available')}</Label>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='date'>{tt('date')}</Label>
                            <Input readOnly value={new Date(data.created_at).toLocaleString() || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='departments'>{tt('departments')}</Label>
                            <Input readOnly value={data.departments.name || ''} />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='courses'>{t('client-card.courses')}</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={tt('courses')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {data.supported_courses.map(course => (
                                            <SelectItem value={course.id} key={course.id}>{course.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='supplier'>{t('client-card.suppliers')}</Label>
                            <Select value=''>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={tt('supplier')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {data.supported_suppliers.map(supplier => (
                                            <SelectItem value={supplier.id} key={supplier.id}>{supplier.supplier.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                    </div> : <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' />}
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}


export default ViewCardAlert