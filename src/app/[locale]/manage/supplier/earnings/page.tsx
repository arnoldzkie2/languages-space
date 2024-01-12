'use client'
import Err from '@/components/global/Err'
import Success from '@/components/global/Success'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import SupplierEarningsHeader from '@/components/super-admin/management/supplier/EarningsHeader'
import { Link } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        supplierID: '',
        name: '',
        quantity: 0,
        rate: 0,
    })

    const { isSideNavOpen, isLoading, departmentID, setErr, setOkMsg, setIsLoading } = useGlobalStore()
    const { supplier, getSupplier } = useAdminSupplierStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prevData => ({
            ...prevData, [name]: value
        }))
    }

    const createEarnings = async (e: React.MouseEvent) => {

        e.preventDefault()

        const { supplierID, name, quantity, rate } = formData

        if (!supplierID) return setErr('Select Supplier')
        if (!name) return setErr('Earning Name')
        if (!quantity) return setErr('Quantity is required')
        if (!rate) return setErr('Rate is required')
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/supplier/balance/earnings', formData)
            if (data.ok) {
                setIsLoading(false)
                setOkMsg('Success')
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

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    useEffect(() => {
        getSupplier()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])

    return (
        <div>
            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <SupplierEarningsHeader />

                <div className='w-full px-8'>
                    <div className='flex p-10 w-1/2 border justify-between'>

                        <div className='flex flex-col w-1/2 gap-5'>
                            <Err />
                            <Success />
                            <Departments />
                            <div className='relative w-full'>
                                <input type="text" className='px-2 py-1.5 outline-none border w-full'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('supplier.search')} />
                            </div>
                            <ul className='flex flex-col gap-3 w-full text-gray-600'>
                                {supplier.length < 1 ? <Skeleton /> : supplier.map(supplier => (
                                    <li key={supplier.id}
                                        className={`${supplier.id === formData.supplierID && 'bg-blue-600 text-white'}
                                     border px-3 h-9 w-full py-1.5 cursor-pointer hover:bg-blue-600 hover:text-white rounded-md`}
                                        onClick={() => setFormData(prevData => ({ ...prevData, supplierID: supplier.id }))}>{supplier.name} ({supplier.username})</li>
                                ))}
                            </ul>
                        </div>

                        <div className='flex flex-col w-1/3 gap-5'>

                            <div className='flex w-full flex-col gap-1'>
                                <label htmlFor="name" className='font-medium text-gray-700'>{tt('name')}</label>
                                <input type="text" className='px-2 py-1.5 outline-none border w-full text-gray-600'
                                    value={formData.name}
                                    name='name'
                                    onChange={handleChange}
                                    placeholder={tt('name')} />
                            </div>

                            <div className='flex w-full flex-col gap-1'>
                                <label htmlFor="rate" className='font-medium text-gray-700'>{tt('rate')}</label>
                                <input type="text" className='px-2 py-1.5 outline-none border w-full text-gray-600'
                                    value={formData.rate}
                                    name='rate'
                                    onChange={handleChange}
                                    placeholder={tt('rate')} />
                            </div>

                            <div className='flex w-full flex-col gap-1'>
                                <label htmlFor="quantity" className='font-medium text-gray-700'>{tt('quantity')}</label>
                                <input type="text" className='px-2 py-1.5 outline-none border w-full text-gray-600'
                                    value={formData.quantity}
                                    name='quantity'
                                    onChange={handleChange}
                                    placeholder={tt('quantity')} />
                            </div>

                            <div>Total: <strong>{formData.quantity * formData.rate}</strong></div>


                            <div className='flex w-full items-center gap-5'>
                                <Link href={'/manage/supplier'} className='border py-2 w-1/2 flex items-center justify-center rounded-md hover:bg-slate-50'>{tt('cancel')}</Link>
                                <button disabled={isLoading && true}
                                    onClick={(e) => createEarnings(e)}
                                    className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} outline-none py-2 w-1/2 self-end text-white rounded-md`}>
                                    {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('create')}</button>
                            </div>
                        </div>

                    </div>
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