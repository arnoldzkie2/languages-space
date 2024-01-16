/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { supplierFormDataValue } from '@/lib/state/super-admin/supplierStore'
import { SupplierFormDataProps, SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import { UploadButton } from '@/utils/uploadthing'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Department } from '@/lib/types/super-admin/globalType'
import useGlobalStore from '@/lib/state/globalStore'
import AdminSideNav from '@/components/admin/AdminSIdeNav'

interface Props {
    params: {
        supplierID: string
    }
}

const Page = ({ params }: Props) => {

    const { supplierID } = params
    const router = useRouter()
    const [formData, setFormData] = useState<SupplierFormDataProps>(supplierFormDataValue)

    const { isSideNavOpen, isLoading, setIsLoading, err, setErr, prevProfileKey, setPrevProfileKey, deleteProfile } = useGlobalStore()

    const updateSupplier = async (e: React.FormEvent) => {

        e.preventDefault()
        const { meeting_info } = formData;

        const filteredMeetingInfo = meeting_info.filter(info =>
            info.service.trim() !== '' && info.meeting_code.trim() !== ''
        );
        const updatedFormData = { ...formData, meeting_info: filteredMeetingInfo };

        const { name, username, password, payment_address, payment_schedule, currency, salary, booking_rate } = updatedFormData

        try {

            if (!name || !password || !username) return setErr('Fill up some inputs')
            if (username.length < 3) return setErr('Username minimum length 3')
            if (password.length < 3) return setErr('Password minimum length 3')
            if (!payment_address) return setErr('Payment Address is required')
            if (!payment_schedule) return setErr('Payment Scheudule is required')
            if (!currency) return setErr('Currency is required')
            if (!salary) return setErr('Basic Salary is required')
            if (!booking_rate) return setErr('Booking Rate is required')

            setIsLoading(true)
            const { data } = await axios.patch('/api/supplier', updatedFormData, { params: { supplierID } })

            if (data.ok) {
                setIsLoading(false)
                router.push('/admin/manage/supplier')
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

    const addMoreMeetingInfo = () => {
        const updatedMeetingInfo = [...formData.meeting_info, { service: '', meeting_code: '' }];
        setFormData(prevState => ({ ...prevState, meeting_info: updatedMeetingInfo }))
    }

    const handleMeetinInfoChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number) => {
        const updatedMeetingInfo = [...formData.meeting_info];
        const propertyName = event.target.name as keyof typeof updatedMeetingInfo[0];
        updatedMeetingInfo[index][propertyName] = event.target.value;
        setFormData({ ...formData, meeting_info: updatedMeetingInfo });
    }

    const removeMeetingInfo = (index: number) => {
        const updatedMeetingInfo = [...formData.meeting_info];
        updatedMeetingInfo.splice(index, 1);
        setFormData({ ...formData, meeting_info: updatedMeetingInfo });
    };

    const handleChange = (e: any) => {

        const { name, type, value, checked } = e.target;

        let updatedFormData: any = { ...formData }; // Create a copy of the formData

        if (type === "checkbox") {
            if (checked) {
                updatedFormData.departments = [...updatedFormData.departments, value];
            } else {
                updatedFormData.departments = updatedFormData.departments.filter((deptId: any) => deptId !== value);
            }
        } else {
            updatedFormData[name] = value;
        }

        setFormData(updatedFormData)

    };

    const handleTagInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {
            event.preventDefault();

            const newTag = event.currentTarget.value.trim().toUpperCase();

            if (newTag && !formData.tags.includes(newTag)) {
                const updatedTags = [...formData.tags, newTag];
                setFormData(prevData => ({ ...prevData, tags: updatedTags }));
                event.currentTarget.value = ''; // Clear the input
            } else {
                event.currentTarget.value = ''
            }
        }

    };

    const handleRemoveTag = (tag: string) => {
        const updatedTags = formData.tags.filter(item => item !== tag);
        const updatedFormData: SupplierFormDataProps = { ...formData, tags: updatedTags };
        setFormData(updatedFormData);
    };

    const retrieveSupplier = async () => {

        try {

            const { data } = await axios.get(`/api/supplier?supplierID=${supplierID}`)
            if (data.ok) {
                const departmentIDs = data.data.departments.length > 0 ? data.data.departments.map((dept: Department) => dept.id) : []
                data.data.departments = departmentIDs
                const { salary, currency, payment_schedule, payment_address, booking_rate } = data.data.balance[0]
                data.data.salary = salary
                data.data.currency = currency
                data.data.payment_schedule = payment_schedule
                data.data.payment_address = payment_address
                data.data.booking_rate = booking_rate
                setFormData(data.data)
            }

        } catch (error: any) {
            console.log(error);
            if (error.response.status === 404) {
                alert('Supplier not found')
                return router.push('/manage/supplier')
            }
            alert('Something went wrong')
            router.push('/manage/supplier')
        }
    }

    useEffect(() => {
        setPrevProfileKey('')
        retrieveSupplier()
    }, [])

    useEffect(() => {

        if (prevProfileKey) {

            deleteProfile(prevProfileKey)
            setPrevProfileKey(formData.profile_key)
        } else {
            setPrevProfileKey(formData.profile_key)
        }

    }, [formData.profile_key])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <>

            <AdminSideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('supplier.update')}</h1>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-2/3 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={updateSupplier}>
                        {err && <small className='w-full text-red-400'>{err}</small>}

                        <div className='w-full flex gap-20'>

                            <SupplierFormFirstRow formData={formData}
                                handleChange={handleChange}
                                handleRemoveTag={handleRemoveTag}
                                handleTagInputChange={handleTagInputChange} />

                            <SupplierFormSecondRow formData={formData}
                                handleChange={handleChange}
                                setFormData={setFormData}
                            />

                            <SupplierFormThirdRow meetingInfo={formData.meeting_info}
                                formData={formData}
                                handleChange={handleChange}
                                addMoreMeetingInfo={addMoreMeetingInfo}
                                handleMeetinInfoChange={handleMeetinInfoChange}
                                removeMeetingInfo={removeMeetingInfo} />

                        </div>

                        <div className='flex items-center gap-10 w-1/2 self-end'>
                            <Link href={'/admin/manage/supplier'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>
                                {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('update')}</button>
                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}


const SupplierFormFirstRow = (props: {
    formData: SupplierFormDataProps,
    handleChange: (e: any) => void,
    handleTagInputChange: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    handleRemoveTag: (tag: string) => void
}) => {

    const { formData, handleChange, handleTagInputChange, handleRemoveTag } = props
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='w-full flex flex-col gap-4'>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="name" className='font-medium text-gray-700'>{tt('name')}</label>
                <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='name' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="username" className='font-medium text-gray-700'>{tt('username')}</label>
                <input required value={formData.username} onChange={handleChange} name='username' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='username' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="email" className='font-medium text-gray-700'>{tt('email')} (optional)</label>
                <input value={formData.email} onChange={handleChange} name='email' type="email" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='email' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="password" className='font-medium text-gray-700'>{tt('password')}</label>
                <input required value={formData.password} onChange={handleChange} name='password' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='password' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="phone" className='font-medium text-gray-700'>{tt('phone')} (optional)</label>
                <input value={formData.phone_number} onChange={handleChange} name='phone_number' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='phone' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="organization" className='font-medium text-gray-700'>{tt('organization')} (optional)</label>
                <input value={formData.organization} onChange={handleChange} name='organization' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='organization' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="note" className='font-medium text-gray-700'>{tt('note')} (optional)</label>
                <input value={formData.note} onChange={handleChange} name='note' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='note' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="tags" className='font-medium text-gray-700' title='Enter to add tags'>{t('supplier.tags')} (optional)</label>
                <input onKeyDown={handleTagInputChange} name='tags' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='tags' />
            </div>

            <div className='flex flex-col gap-3'>
                <span className='font-medium text-gray-700'>{t('supplier.tags')}</span>

                <ul className='w-full flex items-center gap-5 flex-wrap'>
                    {formData.tags.map(item => (
                        <li key={item} onClick={() => handleRemoveTag(item)} className='border cursor-pointer bg-slate-100 py-1 px-3 flex items-center gap-2'>
                            <div>{item}</div>
                            <FontAwesomeIcon icon={faXmark} />
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

const SupplierFormSecondRow = (props: {
    handleChange: (e: any) => void
    formData: SupplierFormDataProps
    setFormData: React.Dispatch<React.SetStateAction<SupplierFormDataProps>>
}) => {

    const { handleChange, formData, setFormData } = props

    const tt = useTranslations('global')
    return (
        <div className='w-full flex flex-col gap-4'>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="gender" className='font-medium text-gray-700'>{tt('gender')} (optional)</label>
                <select name="gender" id="gender" onChange={handleChange} value={formData.gender} className='py-1 outline-none px-3 shadow focus:shadow-blue-600 rounded-sm border'>
                    <option value="" disabled>{tt('select')}</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="employment_status" className='font-medium text-gray-700'>{tt('employment')} (optional)</label>
                <select name="employment_status" id="employment_status" onChange={handleChange} value={formData.employment_status} className='py-1 outline-none px-3 shadow focus:shadow-blue-600 rounded-sm border'>
                    <option value="" disabled>{tt('select')}</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                </select>
            </div>

            <div className='flex w-full items-center gap-2'>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="payment_schedule" className='font-medium text-gray-700'>{tt('schedule')}</label>
                    <select name="payment_schedule" id="payment_schedule" onChange={handleChange} value={formData.payment_schedule} className='py-1 outline-none px-3 shadow focus:shadow-blue-600 rounded-sm border'>
                        <option value="" disabled>{tt('select')}</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="currency" className='font-medium text-gray-700'>{tt('currency')}</label>
                    <select name="currency" id="currency" onChange={handleChange} value={formData.currency} className='py-1 outline-none px-3 shadow focus:shadow-blue-600 rounded-sm border'>
                        <option value="" disabled>{tt('select')}</option>
                        <option value="USD">USD ($)</option>
                        <option value="PHP">PHP (₱)</option>
                        <option value="RMB">RMB (¥)</option>
                        <option value="VND">VND (₫)</option>
                    </select>
                </div>

            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="payment_info" className='font-medium text-gray-700'>{tt('payment-address')} (optional)</label>
                <input value={formData.payment_address} onChange={handleChange} name='payment_address' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='payment_address' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="address" className='font-medium text-gray-700'>{tt('address')} (optional)</label>
                <input value={formData.address} onChange={handleChange} name='address' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='address' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="origin" className='font-medium text-gray-700'>{tt('origin')} (optional)</label>
                <input value={formData.origin} onChange={handleChange} name='origin' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='origin' />
            </div>

            <div className='flex items-center justify-between w-full mt-2'>

                <Image width={110} height={110} src={formData.profile_url || '/profile/profile.svg'} alt='Supplier Profile' className='border rounded-full' />

                <div className='flex flex-col gap-3 items-start'>
                    <span className='block font-medium text-gray-700'>{tt('profile')}</span>
                    <UploadButton
                        endpoint="profileUploader"
                        onClientUploadComplete={(res) => {
                            if (res) {
                                setFormData(prevData => ({ ...prevData, profile_key: res[0].key, profile_url: res[0].url }))
                                alert("Upload Completed");
                            }
                        }}
                        onUploadError={(error: Error) => {
                            alert('Something went wrong.')
                        }}
                    />
                </div>
            </div>
        </div>
    )
}


const SupplierFormThirdRow = (props: {
    meetingInfo: {
        service: string
        meeting_code: string
    }[],
    addMoreMeetingInfo: () => void,
    handleMeetinInfoChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void,
    removeMeetingInfo: (index: number) => void
    handleChange: (e: any) => void
    formData: SupplierFormDataProps
}) => {

    const tt = useTranslations('global')

    return (
        <div className='flex flex-col gap-3 w-full'>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="salary" className='font-medium text-gray-700'>{tt('salary')}</label>
                <input value={props.formData.salary} onChange={props.handleChange} name='salary' type="number" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='salary' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="booking_rate" className='font-medium text-gray-700'>{tt('booking-rate')}</label>
                <input value={props.formData.booking_rate} onChange={props.handleChange} name='booking_rate' type="number" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='booking_rate' />
            </div>

            <h1 className='font-bold text-gray-700'>{tt('meeting')}</h1>
            {props.meetingInfo.map((info, index) => (
                <div key={index} className='flex flex-col gap-3 w-full p-4 border'>
                    <input
                        type="text"
                        name="service"
                        placeholder={tt('service')}
                        value={info.service}
                        className='py-1.5 px-2 outline-none border rounded-md'
                        onChange={(e) => props.handleMeetinInfoChange(e, index)}
                    />
                    <input
                        type="text"
                        name="meeting_code"
                        placeholder={tt('meeting-code')}
                        value={info.meeting_code}
                        className='py-1.5 px-2 outline-none border rounded-md'
                        onChange={(e) => props.handleMeetinInfoChange(e, index)}
                    />
                    <button type='button' onClick={() => props.removeMeetingInfo(index)} className='bg-red-500 hover:bg-red-600 w-1/2 self-end text-white py-1.5 rounded-md outline-none'>{tt('remove')}</button>
                </div>
            ))}
            <button type='button' onClick={props.addMoreMeetingInfo} className='bg-blue-600 hover:bg-blue-500 py-1.5 rounded-md w-full text-white'>{tt("add-more")}</button>
        </div>
    )

}

export default Page
