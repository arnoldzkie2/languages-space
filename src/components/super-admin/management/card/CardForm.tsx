import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import React from 'react'
import Departments from '../Departments';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Courses, SupplierProps } from '@/lib/types/super-admin/supplierTypes';

interface Props {
    formData: {
        id: string;
        name: string;
        price: number;
        balance: number;
        validity: number;
        prepaid: boolean;
        invoice: boolean;
        available: boolean;
        online_renews: boolean;
        repeat_purchases: boolean;
    }
    handleChange: (e: any) => void
    setFormData: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        price: number;
        balance: number;
        validity: number;
        prepaid: boolean;
        invoice: boolean;
        available: boolean;
        online_renews: boolean;
        repeat_purchases: boolean;
    }>>
    searchCourse: string
    searchSupplier: string
    handleCheckboxChange: (supplierID: string, price: number) => void
    toggleCourseSelection: (courseID: string) => void
    skeleton: number[]
    supportedSuppliers: {
        supplierID: string;
        price: number;
    }[]
    filterCourse: Courses[]
    filterSupplier: SupplierProps[]
    courses: Courses[]
    supplier: SupplierProps[]
    setSupportedSuppliers: React.Dispatch<React.SetStateAction<{
        supplierID: string;
        price: number;
    }[]>>
    setSearchCourse: React.Dispatch<React.SetStateAction<string>>
    setSearchSupplier: React.Dispatch<React.SetStateAction<string>>
    supportedCourses: string[],
    selectAllCourses: (courses: Courses[]) => void
    selectAllSupplier: (suppliers: SupplierProps[]) => void
}

const CardForm = (props: Props) => {

    const { formData, handleChange,
        setFormData, searchCourse,
        searchSupplier, skeleton,
        handleCheckboxChange, supportedSuppliers,
        filterCourse, filterSupplier, setSupportedSuppliers,
        setSearchCourse, setSearchSupplier,
        supportedCourses, supplier,
        selectAllCourses, selectAllSupplier,
        courses, toggleCourseSelection

    } = props
    const t = useTranslations()
    return (
        <>
            <div className='w-full flex gap-10'>
                <div className='w-1/2 flex flex-col gap-4'>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">{t("info.name")}</Label>
                        <Input type="text" id="name" name='name' placeholder={t("info.name")} value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="price">{t("card.price")}</Label>
                        <Input type="number" id="price" name='price' placeholder={t("card.price")} value={formData.price} onChange={handleChange} />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                        <Label htmlFor="balance">{t("balance.h1")}</Label>
                        <Input type="number" id="balance" name='balance' placeholder={t("balance.h1")} value={formData.balance} onChange={handleChange} />
                        <div className='absolute right-3 top-7 bg-card py-1 font-black cursor-pointer text-muted-foreground hover:text-foreground text-xs uppercase' onClick={() => setFormData(prevData => ({ ...prevData, balance: 99999 }))}>{t('global.max')}</div>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="validity">{t("card.validity")}</Label>
                        <Input type="number" id="validity" name='validity' placeholder={t("card.validity")} value={formData.validity} onChange={handleChange} />
                    </div>

                </div>
                <div className='w-1/2 flex flex-col gap-4'>
                    <Departments />

                    <div className='w-full flex items-center gap-5'>
                        <Switch id='prepaid' checked={formData.prepaid} onCheckedChange={(val) => setFormData(prev => ({ ...prev, prepaid: val }))} />
                        <Label htmlFor="prepaid" className='font-medium'>{t('card.prepaid')}</Label>
                    </div>

                    <div className='w-full flex items-center gap-5'>
                        <Switch id='invoice' checked={formData.invoice} onCheckedChange={(val) => setFormData(prev => ({ ...prev, invoice: val }))} />
                        <Label htmlFor="invoice" className='font-medium'>{t('card.invoice')}</Label>
                    </div>

                    <div className='w-full flex items-center gap-5'>
                        <Switch id='available' checked={formData.available} onCheckedChange={(val) => setFormData(prev => ({ ...prev, available: val }))} />
                        <Label htmlFor="available" className='font-medium'>{t('card.available')}</Label>
                    </div>

                    <div className='w-full flex items-center gap-5'>
                        <Switch id='online_renews' checked={formData.online_renews} onCheckedChange={(val) => setFormData(prev => ({ ...prev, online_renews: val }))} />
                        <Label htmlFor="online_renews" className='font-medium'>{t('card.online_renew')}</Label>
                    </div>

                    <div className='w-full flex items-center gap-5'>
                        <Switch id='repeat_purchases' checked={formData.repeat_purchases} onCheckedChange={(val) => setFormData(prev => ({ ...prev, repeat_purchases: val }))} />
                        <Label htmlFor="repeat_purchases" className='font-medium'>{t('card.repeat_purchases')}</Label>
                    </div>

                </div>

            </div>

            <div className='w-full flex gap-10'>
                <div className='w-full flex flex-col gap-3'>
                    <h1 className='font-bold'>{t('course.supported')}:</h1>
                    <Label htmlFor="courses-all" className='flex cursor-pointer items-center gap-2'>{t('operation.select_all')}
                        <Checkbox id='course-all' checked={supportedCourses.length === courses.length} onCheckedChange={() => selectAllCourses(courses)} />
                    </Label>
                    <Input value={searchCourse} onChange={(e) => setSearchCourse(e.target.value)} className='outline-none border px-3 py-1.5' placeholder={t('course.search')} />
                    <ul className='w-ful flex flex-col max-h-[500px] overflow-y-auto'>
                        {filterCourse.length > 0 ? filterCourse.map(course => (
                            <Label htmlFor={course.id} key={course.id} className='flex border cursor-pointer hover:bg-muted gap-3 items-center w-full p-3 rounded-sm'>
                                <Checkbox onCheckedChange={() => toggleCourseSelection(course.id)} checked={supportedCourses.includes(course.id)} id={course.id} />
                                <div>{course.name}</div>
                            </Label>
                        )) : skeleton.map(skel => (
                            <div className='flex border gap-3 items-center w-full p-3 h-16 rounded-sm' key={skel}>
                                <Skeleton className='w-5 h-5 rounded-md'></Skeleton>
                                <Skeleton className='w-full h-5 rounded-3xl'></Skeleton>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className='w-full flex flex-col gap-3'>
                    <h1 className='font-bold'>{t('supplier.supported')}:</h1>
                    <Label htmlFor="suppliers-all" className='flex cursor-pointer items-center gap-2'>{t('operation.select_all')}
                        <Checkbox id='suppliers-all' checked={supportedSuppliers.length === supplier.length} onCheckedChange={() => selectAllSupplier(supplier)} />
                    </Label>
                    <Input type="text" value={searchSupplier} onChange={(e) => setSearchSupplier(e.target.value)} className='outline-none border px-3 py-1.5' placeholder={t('supplier.search')} />
                    <ul className='w-ful flex flex-col max-h-[500px] overflow-y-auto'>
                        {filterSupplier.length > 0 ? filterSupplier.map(supplier => (
                            <Label htmlFor={supplier.id} key={supplier.id} className='flex border cursor-pointer hover:bg-muted gap-3 items-center w-full px-3 py-1 rounded-sm'>
                                <Checkbox
                                    id={supplier.id}
                                    onCheckedChange={() => {
                                        handleCheckboxChange(supplier.id, 1)
                                    }}
                                    checked={supportedSuppliers.some(
                                        (sup) => sup.supplierID === supplier.id
                                    )}
                                />
                                <div className='mr-auto'>{supplier.name}</div>
                                <Input
                                    type="number"
                                    className='w-14 appearance-none text-center px-2 outline-none border py-0'
                                    value={supportedSuppliers.find((supp) => supp.supplierID === supplier.id)?.price || ''}
                                    onChange={(e) => {
                                        const newPrice = parseFloat(e.target.value);
                                        if (!isNaN(newPrice) && newPrice) {
                                            const updatedSuppliers = supportedSuppliers.map((supp) => {
                                                if (supp.supplierID === supplier.id) {
                                                    return { supplierID: supp.supplierID, price: newPrice };
                                                }
                                                return supp;
                                            });
                                            setSupportedSuppliers(updatedSuppliers);
                                        }
                                    }}

                                />
                            </Label>
                        )) : skeleton.map(skel => (
                            <div key={skel} className='flex border gap-3 items-center w-full p-3 rounded-sm'>
                                <Skeleton className='w-5 h-5 rounded-md'></Skeleton>
                                <Skeleton className='mr-auto w-2/3 rounded-3xl h-5'></Skeleton>
                                <Skeleton className='w-10 h-5 rounded-md'></Skeleton>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>

        </>
    )
}

export default CardForm