'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import SupplierDeductionHeader from '@/components/super-admin/management/supplier/DeductionsHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRouter } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { cn } from '@/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {

    const [formData, setFormData] = useState({
        supplierID: '',
        name: '',
        quantity: 0,
        rate: 0,
    })
    const [openSupplier, setOpenSupplier] = useState(false)

    const router = useRouter()

    const departmentID = useDepartmentStore(s => s.departmentID)
    const { isSideNavOpen, setErr, setOkMsg, setIsLoading } = useGlobalStore()
    const { supplier, getSupplier } = useAdminSupplierStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prevData => ({
            ...prevData, [name]: value
        }))
    }

    const createDeductions = async (e: React.FormEvent) => {

        e.preventDefault()

        const { supplierID, name, quantity, rate } = formData

        if (!supplierID) return setErr('Select Supplier')
        if (!name) return setErr('Earning Name')
        if (!quantity) return setErr('Quantity is required')
        if (!rate) return setErr('Rate is required')
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/supplier/balance/deductions', formData)
            if (data.ok) {
                setIsLoading(false)
                toast('Success! deductions created.')
                setFormData({ supplierID: '', name: '', quantity: 0, rate: 0 })
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

    useEffect(() => {
        getSupplier()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])

    return (
        <div>
            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <SupplierDeductionHeader />

                <div className='w-full px-8'>
                    <Card className='w-1/4'>
                        <CardHeader>
                            <CardTitle>{t("supplier.deductions")}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='flex flex-col w-full gap-5' onSubmit={createDeductions}>

                                <Departments />

                                <div className='flex w-full flex-col gap-1.5'>
                                    <Label>{t('side_nav.supplier')}</Label>
                                    <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openSupplier}
                                                className={cn(
                                                    "w-full justify-between",
                                                    !formData.supplierID && "text-muted-foreground"
                                                )}
                                            >
                                                {formData.supplierID
                                                    ? supplier.find((supplier) => supplier.id === formData.supplierID)?.username
                                                    : t('supplier.select.h1')}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder={t('supplier.search')}
                                                    className="h-9"
                                                />
                                                <CommandEmpty>{t('supplier.404')}</CommandEmpty>
                                                <CommandGroup>
                                                    {supplier.length > 0 ? supplier.map(supplier => (
                                                        <CommandItem
                                                            key={supplier.id}
                                                            className={`${formData.supplierID === supplier.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                            value={supplier.username}
                                                            onSelect={() => {
                                                                setFormData(prev => ({ ...prev, supplierID: supplier.id }))
                                                                setOpenSupplier(false)
                                                            }}
                                                        >
                                                            {supplier.username}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    formData.supplierID === supplier.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    )) : <CommandItem>{t('supplier.404')}</CommandItem>}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className='flex w-full flex-col gap-1'>
                                    <Label htmlFor="name">{t('info.name')}</Label>
                                    <Input type="text"
                                        value={formData.name}
                                        name='name'
                                        onChange={handleChange}
                                        placeholder={t('info.name')} />
                                </div>

                                <div className='flex w-full flex-col gap-1'>
                                    <Label htmlFor="rate">{t('info.rate')}</Label>
                                    <Input type="text"
                                        value={formData.rate}
                                        name='rate'
                                        onChange={handleChange}
                                        placeholder={t('info.rate')} />
                                </div>

                                <div className='flex w-full flex-col gap-1'>
                                    <Label htmlFor="quantity">{t('info.quantity')}</Label>
                                    <Input type="text"
                                        value={formData.quantity}
                                        name='quantity'
                                        onChange={handleChange}
                                        placeholder={t('info.quantity')} />
                                </div>

                                <div>{t('pagination.total')}: <strong>{formData.quantity * formData.rate}</strong></div>

                                <div className='flex w-full items-center gap-5'>
                                    <Button onClick={() => router.push('/admin/manage/supplier')} className='w-full' variant={'ghost'} type='button'>{t('operation.cancel')}</Button>
                                    <SubmitButton msg={t("operation.confirm")} style='w-full' />
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

const Skeleton = () => {
    const skeleton = useGlobalStore(state => state.skeleton)
    return (
        <>
            {skeleton.map(item => (
                <li key={item} className='w-full bg-slate-100 rounded-md h-9 animate-pulse'></li>
            ))}
        </>
    )
}

export default Page