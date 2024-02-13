/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import { clientCardValue } from '@/lib/state/super-admin/clientCardStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Courses, SupplierProps } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
    params: {
        cardID: string
    }
}

const Page = ({ params }: Props) => {

    const router = useRouter()

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    const [formData, setFormData] = useState(clientCardValue)

    const [supportedCourses, setSupportedCourses] = useState<string[]>([])
    const [supportedSuppliers, setSupportedSuppliers] = useState<{ supplierID: string, price: number }[]>([])

    const [searchCourse, setSearchCourse] = useState('')
    const [searchSupplier, setSearchSupplier] = useState('')

    const { isSideNavOpen, setIsLoading, setErr } = useGlobalStore()
    const { setDepartmentID, departmentID } = useDepartmentStore()
    const { supplier, getSupplier, getCourses, courses } = useAdminSupplierStore()

    const filterCourse = courses.filter(course => course.name.toUpperCase().includes(searchCourse.toUpperCase()))
    const filterSupplier = supplier.filter(sup => sup.name.toUpperCase().includes(searchSupplier.toUpperCase()))

    const retrieveCard = async () => {
        try {

            const { data } = await axios.get('/api/client/card-list', {
                params: { cardID: params.cardID }
            })

            if (data.ok) {
                setSupportedSuppliers(data.data.supported_suppliers.map((sup: { supplierID: string, price: number }) => ({ supplierID: sup.supplierID, price: sup.price })))
                setSupportedCourses(data.data.supported_courses.map((course: { id: string }) => course.id))
                setFormData(data.data)
                setDepartmentID(data.data.departmentID)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    const updateCard = async (e: any) => {

        e.preventDefault()
        const { balance, price } = formData
        if (price < 1) return setErr('Price must be greater than 0')
        if (balance < 1) return setErr('Balance must be greater than 0')
        if (!departmentID) return setErr('Select Department')

        try {

            setIsLoading(true)

            const { name, price, balance, online_renews, invoice, available, validity, repeat_purchases, prepaid } = formData

            const { data } = await axios.patch('/api/client/card-list',
                {
                    name, price: Number(price), balance: Number(balance), online_renews, invoice, available, departmentID,
                    validity: Number(validity), repeat_purchases, prepaid,
                    courses: supportedCourses, suppliers: supportedSuppliers
                }, {
                params: {
                    clientCardID: params.cardID
                }
            }
            )

            if (data.ok) {
                setIsLoading(false)
                toast("Success! card has been updated.")
                router.push('/admin/manage/card')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg === 'client_card_name_exist') return setErr('Card name already exist!')
            return setErr('Something went wrong')
        }

    }

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }

    const selectAllCourses = (courses: Courses[]) => {

        if (supportedCourses.length === courses.length) {
            setSupportedCourses([])

        } else {
            const coursesID = courses.map(course => course.id)
            setSupportedCourses(coursesID)
        }

    }

    const selectAllSupplier = (suppliers: SupplierProps[]) => {


        if (supportedSuppliers.length === supplier.length) {
            setSupportedSuppliers([]);

        } else {
            const supplierPrices = suppliers.map(sup => {
                // Check if the supplier is already supported
                const supportedSupplier = supportedSuppliers.find(supported => supported.supplierID === sup.id);
                if (supportedSupplier) {
                    // If supported, set the price to the price from supportedSuppliers
                    return supportedSupplier;
                } else {
                    // If not supported, set the price to 1
                    return {
                        supplierID: sup.id,
                        price: 1
                    };
                }
            });
            setSupportedSuppliers(supplierPrices);
        }
    }

    const toggleCourseSelection = (courseID: string) => {
        if (supportedCourses.includes(courseID)) {
            // Course ID exists in the state, remove it
            const updatedCourses = supportedCourses.filter((id) => id !== courseID);
            setSupportedCourses(updatedCourses);
        } else {
            // Course ID doesn't exist in the state, add it
            setSupportedCourses(prevState => [...prevState, courseID]);
        }
    };

    const handleCheckboxChange = (supplierID: string, price: number) => {
        // Check if the supplier is already in the supportedSuppliers array
        const existingSupplierIndex = supportedSuppliers.findIndex(
            (supplier) => supplier.supplierID === supplierID
        );

        // If the supplier is not in the array, add it with the selected price
        if (existingSupplierIndex === -1) {
            setSupportedSuppliers([
                ...supportedSuppliers,
                { supplierID, price },
            ]);
        } else {
            // If the supplier is already in the array, remove it
            const updatedSuppliers = supportedSuppliers.filter(
                (supplier) => supplier.supplierID !== supplierID
            );
            setSupportedSuppliers(updatedSuppliers);
        }
    }

    useEffect(() => {

        if (formData.id) {
            getSupplier()
            getCourses()
        } else {
            retrieveCard()
        }
    }, [departmentID, formData.id])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-16 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('client-card.update')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                        <Link href={'/admin/manage/card'} className='flex items-center hover:text-primary justify-center w-32 cursor-pointer gap-1'>
                            <div>{t('client-card.h1')}</div>
                        </Link>
                        {isAdminAllowed('bind_cards') && <Link href={'/admin/manage/card/bind'} className='flex items-center gap-1 hover:text-primary justify-center w-32 cursor-pointer'>
                            <div>{t('client.card.bind')}</div>
                        </Link>}
                    </ul>
                </nav>

                <div className='w-full px-8'>
                    <Card className='w-1/3 h-full'>
                        <CardHeader>
                            <CardTitle>{t('client-card.update')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='w-full flex flex-col gap-10' onSubmit={updateCard}>
                                <div className='w-full flex gap-10'>
                                    <div className='w-1/2 flex flex-col gap-4'>

                                        <Departments />

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="name">{tt("name")}</Label>
                                            <Input type="text" id="name" name='name' placeholder={tt("name")} value={formData.name} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="price">{tt("price")}</Label>
                                            <Input type="number" id="price" name='price' placeholder={tt("price")} value={formData.price} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                                            <Label htmlFor="balance">{tt("balance")}</Label>
                                            <Input type="number" id="balance" name='balance' placeholder={tt("balance")} value={formData.balance} onChange={handleChange} />
                                            <div className='absolute right-3 top-7 bg-card py-1 font-black cursor-pointer text-muted-foreground hover:text-foreground text-xs uppercase' onClick={() => setFormData(prevData => ({ ...prevData, balance: 99999 }))}>{t('client-card.max')}</div>
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="validity">{t("client-card.validity")}</Label>
                                            <Input type="number" id="validity" name='validity' placeholder={t("client-card.validity")} value={formData.validity} onChange={handleChange} />
                                        </div>

                                    </div>
                                    <div className='w-1/2 flex flex-col gap-4'>

                                        <div className='w-full flex items-center gap-5'>
                                            <Switch id='prepaid' checked={formData.prepaid} onCheckedChange={(val) => setFormData(prev => ({ ...prev, prepaid: val }))} />
                                            <Label htmlFor="prepaid" className='font-medium'>{t('client-card.prepaid')}</Label>
                                        </div>

                                        <div className='w-full flex items-center gap-5'>
                                            <Switch id='invoice' checked={formData.invoice} onCheckedChange={(val) => setFormData(prev => ({ ...prev, invoice: val }))} />
                                            <Label htmlFor="invoice" className='font-medium'>{t('client-card.invoice')}</Label>
                                        </div>

                                        <div className='w-full flex items-center gap-5'>
                                            <Switch id='available' checked={formData.available} onCheckedChange={(val) => setFormData(prev => ({ ...prev, available: val }))} />
                                            <Label htmlFor="available" className='font-medium'>{t('client-card.available')}</Label>
                                        </div>

                                        <div className='w-full flex items-center gap-5'>
                                            <Switch id='online_renews' checked={formData.online_renews} onCheckedChange={(val) => setFormData(prev => ({ ...prev, online_renews: val }))} />
                                            <Label htmlFor="online_renews" className='font-medium'>{t('client-card.online_renews')}</Label>
                                        </div>

                                        <div className='w-full flex items-center gap-5'>
                                            <Switch id='repeat_purchases' checked={formData.repeat_purchases} onCheckedChange={(val) => setFormData(prev => ({ ...prev, repeat_purchases: val }))} />
                                            <Label htmlFor="repeat_purchases" className='font-medium'>{t('client-card.repeat_purchases')}</Label>
                                        </div>

                                    </div>

                                </div>

                                <div className='w-full flex gap-10'>
                                    <div className='w-full flex flex-col gap-3'>
                                        <h1 className='font-bold'>{t('client-card.courses')}:</h1>
                                        <Label htmlFor="course-all" className='flex cursor-pointer items-center gap-2'>{t('client-card.select-all')}
                                            <Checkbox id='course-all' checked={supportedCourses.length === courses.length} onCheckedChange={() => selectAllCourses(courses)} />
                                        </Label>
                                        <Input value={searchCourse} onChange={(e) => setSearchCourse(e.target.value)} className='outline-none border px-3 py-1.5' placeholder={t('courses.search')} />
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
                                        <h1 className='font-bold'>{t('client-card.suppliers')}:</h1>
                                        <Label htmlFor="suppliers-all" className='flex cursor-pointer items-center gap-2'>{t('client-card.select-all')}
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
                                <div className='flex items-center gap-10 w-full'>
                                    <Button type='button' onClick={() => router.push('/admin/manage/card')} variant={'ghost'} className='w-full'>{tt('cancel')}</Button>
                                    <SubmitButton msg={tt('update')} style='w-full' />
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    )
}

export default Page