/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import CardForm from '@/components/super-admin/management/card/CardForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

const Page = () => {

    const router = useRouter()

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    const [formData, setFormData] = useState(clientCardValue)

    const [supportedCourses, setSupportedCourses] = useState<string[]>([])

    const [supportedSuppliers, setSupportedSuppliers] = useState<{ supplierID: string, price: number }[]>([])

    const [searchCourse, setSearchCourse] = useState('')
    const [searchSupplier, setSearchSupplier] = useState('')

    const { isSideNavOpen, setErr, setIsLoading } = useGlobalStore()
    const { departmentID } = useDepartmentStore()
    const { supplier, getSupplier, getCourses, courses } = useAdminSupplierStore()

    const filterCourse = courses.filter(course => course.name.toUpperCase().includes(searchCourse.toUpperCase()))
    const filterSupplier = supplier.filter(sup => sup.name.toUpperCase().includes(searchSupplier.toUpperCase()))

    const createCard = async (e: React.FormEvent) => {

        e.preventDefault()
        const { balance, price } = formData
        if (!departmentID) return setErr('Select Department')
        if (price < 1) return setErr('Price must be greater than 0')
        if (balance < 1) return setErr('Balance must be greater than 0')
        try {

            setIsLoading(true)
            const { name, price, balance, repeat_purchases, online_renews, invoice, validity, available, prepaid } = formData
            const { data } = await axios.post('/api/client/card-list',
                {
                    name, price: Number(price), balance: Number(balance), repeat_purchases, online_renews, invoice,
                    validity: Number(validity), available, departmentID, prepaid,
                    courses: supportedCourses, suppliers: supportedSuppliers
                }
            )

            if (data.ok) {
                setIsLoading(false)
                toast("Success! card has been created.")
                router.push('/admin/manage/card')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
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
    };


    useEffect(() => {
        getSupplier()
        getCourses()
    }, [departmentID])


    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const t = useTranslations()

    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-16 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('card.create')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                        <Link href={'/admin/manage/card'} className='flex items-center hover:text-primary justify-center w-32 cursor-pointer gap-1'>
                            <div>{t('card.manage')}</div>
                        </Link>
                        {isAdminAllowed('bind_cards') && <Link href={'/admin/manage/card/bind'} className='flex items-center gap-1 hover:text-primary justify-center w-32 cursor-pointer'>
                            <div>{t('card.bind')}</div>
                        </Link>}
                    </ul>
                </nav>

                <div className='w-full px-8'>
                    <Card className='w-1/3 h-full'>
                        <CardHeader>
                            <CardTitle>{t('card.create')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='w-full flex flex-col gap-10' onSubmit={createCard}>
                                <CardForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    toggleCourseSelection={toggleCourseSelection}
                                    supportedCourses={supportedCourses}
                                    supplier={supplier}
                                    searchCourse={searchCourse}
                                    searchSupplier={searchSupplier}
                                    selectAllCourses={selectAllCourses}
                                    selectAllSupplier={selectAllSupplier}
                                    handleChange={handleChange}
                                    handleCheckboxChange={handleCheckboxChange}
                                    filterCourse={filterCourse}
                                    filterSupplier={filterSupplier}
                                    setSearchCourse={setSearchCourse}
                                    setSupportedSuppliers={setSupportedSuppliers}
                                    setSearchSupplier={setSearchSupplier}
                                    skeleton={skeleton}
                                    supportedSuppliers={supportedSuppliers}
                                    courses={courses}
                                />
                                <div className='flex items-center gap-10 w-full'>
                                    <Button type='button' onClick={() => router.push('/admin/manage/card')} variant={'ghost'} className='w-full'>{t('operation.cancel')}</Button>
                                    <SubmitButton msg={t('operation.create')} style='w-full' />
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