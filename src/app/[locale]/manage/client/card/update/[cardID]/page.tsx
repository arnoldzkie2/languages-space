/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { OurFileRouter } from '@/app/api/uploadthing/core'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import { clientCardValue } from '@/lib/state/super-admin/clientCardStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Courses, Supplier } from '@/lib/types/super-admin/supplierTypes'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        cardID: string
    }
}

const Page = ({ params }: Props) => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const router = useRouter()

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    const [formData, setFormData] = useState(clientCardValue)

    const [supportedCourses, setSupportedCourses] = useState<string[]>([])

    const [supportedSuppliers, setSupportedSuppliers] = useState<{ supplierID: string, price: number }[]>([])


    const [searchCourse, setSearchCourse] = useState('')
    const [searchSupplier, setSearchSupplier] = useState('')

    const { isSideNavOpen, departmentID, setDepartmentID } = useAdminGlobalStore()
    const { supplier, getSupplier, getCourses, courses } = useAdminSupplierStore()

    const filterCourse = courses.filter(course => course.name.toUpperCase().includes(searchCourse.toUpperCase()))
    const filterSupplier = supplier.filter(sup => sup.name.toUpperCase().includes(searchSupplier.toUpperCase()))

    const [isLoading, setIsLoading] = useState(false)

    const [err, setErr] = useState('')

    const retrieveCard = async () => {
        try {

            const { data } = await axios.get('/api/client/card-list', {
                params: { clientCardID: params.cardID }
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
        const { balance, price, quantity } = formData
        if (price < 1) return setErr('Price must be greater than 0')
        if (quantity < 1) return setErr('Quantity must be greater than 0')
        if (balance < 1) return setErr('Balance must be greater than 0')
        if (!departmentID) return setErr('Select Department')

        try {

            setIsLoading(true)

            const { name, price, balance, online_renews, invoice, available, validity, repeat_purchases, settlement_period, quantity } = formData

            const { data } = await axios.patch('/api/client/card-list',
                {
                    name, price: Number(price), balance: Number(balance), online_renews, invoice, available, departmentID,
                    validity: Number(validity), repeat_purchases, settlement_period, quantity: Number(quantity),
                    courses: supportedCourses, suppliers: supportedSuppliers
                }, {
                params: {
                    clientCardID: params.cardID
                }
            }
            )

            if (data.ok) {
                setIsLoading(false)
                router.push('/manage/client/card')
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

    const selectAllSupplier = (suppliers: Supplier[]) => {


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
        retrieveCard()
        getSupplier()
        getCourses()
    }, [])

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 w-32 h-5 rounded-3xl animate-pulse'></li>
    )

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client-card.update')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {session.status !== 'loading' ?
                            <Link href={'/manage/client'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('client.h1')}</div>
                            </Link> : clientHeaderSkeleton}
                        {session.status !== 'loading' ?
                            <Link href={'/manage/client/card'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('client-card.h1')}</div>
                            </Link> : clientHeaderSkeleton}
                        {session.status !== 'loading' ? <li className='flex items-center gap-1 text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer'>
                            <div>{t('client.card.bind')}</div>
                        </li> : clientHeaderSkeleton}
                    </ul>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={updateCard}>
                        {err && <small className='w-full text-red-400'>{err}</small>}
                        <div className='w-full flex gap-10'>

                            <div className='w-1/2 flex flex-col gap-4'>

                                <Departments />

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="name" className='font-medium px-2'>{tt('name')}</label>
                                    <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none py-1 px-3' id='name' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="price" className='font-medium px-2'>{tt('price')}</label>
                                    <input required value={formData.price} onChange={handleChange} name='price' type="number" className=' w-full border outline-none py-1 px-3' id='price' />
                                </div>

                                <div className='w-full flex flex-col gap-2 relative'>
                                    <label htmlFor="balance" className='font-medium px-2'>{tt('balance')}</label>
                                    <input value={formData.balance} onChange={handleChange} name='balance' type="number" className='w-full border outline-none py-1 px-3' id='balance' />
                                    <div className='absolute right-3 top-10 font-black cursor-pointer hover:text-blue-600 text-xs uppercase' onClick={() => setFormData(prevData => ({ ...prevData, balance: 99999 }))}>{t('client-card.max')}</div>
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="validity" className='font-medium px-2'>{t('client-card.validity')}</label>
                                    <input required value={formData.validity} onChange={handleChange} name='validity' type="number" className='w-full border outline-none py-1 px-3' id='validity' />
                                </div>

                            </div>
                            <div className='w-1/2 flex flex-col gap-4'>

                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="invoice" className='font-medium'>{t('client-card.invoice')}</label>
                                    <input checked={formData.invoice} onChange={handleChange} name='invoice' type="checkbox" className='border outline-none py-1 px-3' id='invoice' />
                                </div>

                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="repeat_purchases" className='font-medium'>{t('client-card.repeat_purchases')}</label>
                                    <input checked={formData.repeat_purchases} onChange={handleChange} name='repeat_purchases' type="checkbox" className=' border outline-none py-1 px-3' id='repeat_purchases' />
                                </div>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="online_renews" className='font-medium'>{t('client-card.online_renews')}</label>
                                    <input checked={formData.online_renews} onChange={handleChange} name='online_renews' type="checkbox" className=' border outline-none py-1 px-3' id='online_renews' />
                                </div>

                                <div className='w-full flex justify-between items-center gap-2'>
                                    <label htmlFor="available" className='font-medium'>{t('client-card.available')}</label>
                                    <input checked={formData.available} onChange={handleChange} name='available' type="checkbox" className='border outline-none py-1 px-3' id='available' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="quantity" className='font-medium'>{t('client-card.quantity')}</label>
                                    <input required value={formData.quantity} onChange={handleChange} name='quantity' type="number" className='border outline-none py-1 px-3' id='quantity' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="settlement_period" className='font-medium'>{t('client-card.settlement_period')}</label>
                                    <input required value={formData.settlement_period} onChange={handleChange} name='settlement_period' type="date" className='border outline-none py-1 px-3' id='settlement_period' />
                                </div>

                            </div>

                        </div>

                        <div className='w-full flex gap-10'>
                            <div className='w-full flex flex-col gap-3'>
                                <h1 className='font-bold'>{t('client-card.courses')}:</h1>
                                <label htmlFor="courses-all" className='flex cursor-pointer items-center gap-2'>{t('client-card.select-all')}
                                    <input id='courses-all' checked={supportedCourses.length === courses.length} type='checkbox' onChange={() => selectAllCourses(courses)} />
                                </label>
                                <input type="text" value={searchCourse} onChange={(e) => setSearchCourse(e.target.value)} className='outline-none border px-3 py-1.5' placeholder={t('courses.search')} />
                                <ul className='w-ful flex flex-col max-h-[500px] overflow-y-auto'>
                                    {filterCourse.length > 0 ? filterCourse.map(course => (
                                        <label htmlFor={course.id} key={course.id} className='flex border cursor-pointer hover:bg-slate-100 gap-3 items-center w-full p-3 rounded-sm'>
                                            <input onChange={() => toggleCourseSelection(course.id)} checked={supportedCourses.includes(course.id)} id={course.id} type="checkbox" />
                                            <div>{course.name}</div>
                                        </label>
                                    )) : skeleton.map(skel => (
                                        <div className='flex border gap-3 items-center w-full p-3 h-16 rounded-sm' key={skel}>
                                            <div className='w-5 h-5 bg-slate-100 animate-pulse rounded-md'></div>
                                            <div className='w-full h-5 bg-slate-100 rounded-3xl animate-pulse'></div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            <div className='w-full flex flex-col gap-3'>
                                <h1 className='font-bold'>{t('client-card.suppliers')}:</h1>
                                <label htmlFor="suppliers-all" className='flex cursor-pointer items-center gap-2'>{t('client-card.select-all')}
                                    <input id='suppliers-all' checked={supportedSuppliers.length === supplier.length} type='checkbox' onChange={() => selectAllSupplier(supplier)} />
                                </label>
                                <input type="text" value={searchSupplier} onChange={(e) => setSearchSupplier(e.target.value)} className='outline-none border px-3 py-1.5' placeholder={t('supplier.search')} />
                                <ul className='w-ful flex flex-col max-h-[500px] overflow-y-auto'>
                                    {filterSupplier.length > 0 ? filterSupplier.map(supplier => (
                                        <label htmlFor={supplier.id} key={supplier.id} className='flex border cursor-pointer hover:bg-slate-100 gap-3 items-center w-full p-3 rounded-sm'>
                                            <input
                                                id={supplier.id}
                                                type="checkbox"
                                                onChange={(e) => {
                                                    handleCheckboxChange(supplier.id, 1)
                                                }}
                                                checked={supportedSuppliers.some(
                                                    (sup) => sup.supplierID === supplier.id
                                                )}
                                            />
                                            <div className='mr-auto'>{supplier.name}</div>
                                            <input
                                                type="number"
                                                className='w-12 appearance-none text-center px-2 py-0.5 outline-none border'
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
                                        </label>
                                    )) : skeleton.map(skel => (
                                        <div key={skel} className='flex border gap-3 items-center w-full p-3 rounded-sm'>
                                            <div className='w-5 h-5 rounded-md bg-slate-100 animate-pulse'></div>
                                            <div className='mr-auto w-2/3 bg-slate-100 rounded-3xl animate-pulse h-5'></div>
                                            <div className='w-10 h-5 rounded-md bg-slate-100 animate-pulse'></div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='flex items-center gap-10 w-full'>
                            <Link href={'/manage/client/card'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>{isLoading ?
                                <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('update')}</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Page