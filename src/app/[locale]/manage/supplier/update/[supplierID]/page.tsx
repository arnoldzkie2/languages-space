/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { supplierFormDataValue } from '@/lib/state/super-admin/supplierStore'
import { Department } from '@/lib/types/super-admin/globalType'
import { SupplierFormDataProps, SupplierMeetingInfo } from '@/lib/types/super-admin/supplierTypes'
import { UploadButton } from '@/utils/uploadthing'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = ({ params }: { params: { supplierID: string } }) => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const { supplierID } = params

    const router = useRouter()

    const [formData, setFormData] = useState<SupplierFormDataProps>(supplierFormDataValue)

    const { isSideNavOpen, departments, getDepartments, setOkMsg } = useAdminGlobalStore()

    const [isLoading, setIsLoading] = useState(false)

    const [err, setErr] = useState('')

    const updateSupplier = async (e: any) => {

        e.preventDefault()

        const { name, username, password, meeting_info } = formData
        if (!name || !password || !username) return setErr('Fill up some inputs')
        if (username.length < 3) return setErr('Username minimum length 3')
        if (password.length < 3) return setErr('Password minimum length 3')

        const filteredMeetingInfo = meeting_info.filter(info =>
            info.service.trim() !== '' && info.meeting_code.trim() !== ''
        );

        const updatedFormData = { ...formData, meeting_info: filteredMeetingInfo };
        try {

            setIsLoading(true)
            const { data } = await axios.patch(`/api/supplier?supplierID=${supplierID}`, updatedFormData)

            if (data.ok) {
                setIsLoading(false)
                router.push('/manage/supplier')
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
            updatedFormData[name] = value; // Use a type assertion for the key
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
    }

    const getSupplier = async () => {

        try {

            const { data } = await axios.get(`/api/supplier?supplierID=${supplierID}`)
            if (data.ok) {
                const departmentIDs = data.data.departments.length > 0 ? data.data.departments.map((dept: Department) => dept.id) : []
                data.data.departments = departmentIDs
                setFormData(data.data)
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
            router.push('/manage/supplier')
        }
    }

    useEffect(() => {
        getDepartments()
        getSupplier()
    }, [])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('supplier.create')}</h1>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-2/3 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={updateSupplier}>
                        {err && <small className='w-full text-red-400'>{err}</small>}
                        <div className='w-full flex gap-20'>

                            <div className='w-full flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="name" className='font-medium'>{tt('name')}</label>
                                    <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none py-1 px-3' id='name' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="username" className='font-medium'>{tt('username')}</label>
                                    <input required value={formData.username} onChange={handleChange} name='username' type="text" className='w-full border outline-none py-1 px-3' id='username' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="email" className='font-medium'>{tt('email')} (optional)</label>
                                    <input value={formData.email || ''} onChange={handleChange} name='email' type="email" className='w-full border outline-none py-1 px-3' id='email' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="password" className='font-medium'>{tt('password')}</label>
                                    <input required value={formData.password} onChange={handleChange} name='password' type="text" className='w-full border outline-none py-1 px-3' id='password' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="phone" className='font-medium'>{tt('phone')} (optional)</label>
                                    <input value={formData.phone_number || ''} onChange={handleChange} name='phone_number' type="text" className='w-full border outline-none py-1 px-3' id='phone' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="organization" className='font-medium'>{tt('organization')} (optional)</label>
                                    <input value={formData.organization || ''} onChange={handleChange} name='organization' type="text" className='w-full border outline-none py-1 px-3' id='organization' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="tags" className='font-medium' title='Enter to add tags'>{tt('tags')} (optional)</label>
                                    <input onKeyDown={handleTagInputChange} name='tags' type="text" className='w-full border outline-none py-1 px-3' id='tags' />
                                </div>

                            </div>

                            <div className='w-full flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="gender" className='font-medium'>{tt('gender')} (optional)</label>
                                    <select name="gender" id="gender" onChange={handleChange} value={formData.gender || ''} className='py-1 outline-none px-3 border'>
                                        <option value="" disabled>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="employment_status" className='font-medium'>{tt('employment')} (optional)</label>
                                    <select name="employment_status" id="employment_status" onChange={handleChange} value={formData.employment_status || ''} className='py-1 outline-none px-3 border'>
                                        <option value="" disabled>Select</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                    </select>
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="address" className='font-medium'>{tt('address')} (optional)</label>
                                    <input value={formData.address || ''} onChange={handleChange} name='address' type="text" className='w-full border outline-none py-1 px-3' id='address' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="origin" className='font-medium'>{tt('origin')} (optional)</label>
                                    <input value={formData.origin || ''} onChange={handleChange} name='origin' type="text" className='w-full border outline-none py-1 px-3' id='origin' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="payment_info" className='font-medium'>{tt('payment')} (optional)</label>
                                    <input value={formData.payment_info || ''} onChange={handleChange} name='payment_info' type="text" className='w-full border outline-none py-1 px-3' id='payment_info' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="note" className='font-medium'>{tt('note')} (optional)</label>
                                    <input value={formData.note || ''} onChange={handleChange} name='note' type="text" className='w-full border outline-none py-1 px-3' id='note' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label className='block font-medium'>{tt('departments')}</label>
                                    {departments && departments.map((dept) => (
                                        <div key={dept.id} className="flex items-center">
                                            <input onChange={handleChange}
                                                type="checkbox"
                                                id={`department_${dept.id}`}
                                                name={`department_${dept.id}`}
                                                value={dept.id}
                                                checked={formData.departments.includes(dept.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`department_${dept.id}`} className="mr-4">{dept.name}</label>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className='flex flex-col gap-3 items-start'>
                                        <span className='block font-medium'>{tt('profile')}</span>
                                        <UploadButton
                                            endpoint="profileUploader"
                                            onClientUploadComplete={async (res) => {

                                                if (res) {

                                                    const { data } = await axios.post('/api/uploadthing/profile/change/supplier', {
                                                        profile: res[0], supplierID: formData.id
                                                    })

                                                    if (data.ok) {
                                                        setFormData(prevState => ({ ...prevState, profile_url: res[0].url, profile_key: res[0].key }))
                                                        setOkMsg('Profile Changed')
                                                        setTimeout(() => {
                                                            setOkMsg('')
                                                        }, 4000)
                                                    }

                                                }

                                            }}
                                            onUploadError={(error: Error) => {
                                                alert('Something went wrong.')
                                            }}
                                        />
                                    </div>

                                </div>

                            </div>

                            <div className='flex flex-col gap-3 w-full'>
                                <h1>{tt('meeting')}</h1>
                                {formData.meeting_info.map((info, index) => (
                                    <div key={index} className='flex flex-col gap-3 w-full p-4 border'>
                                        <input
                                            type="text"
                                            required
                                            name="service"
                                            placeholder={tt('service')}
                                            value={info.service}
                                            className='py-1.5 px-2 outline-none border rounded-md'
                                            onChange={(e) => handleMeetinInfoChange(e, index)}
                                        />
                                        <input
                                            type="text"
                                            required
                                            name="meeting_code"
                                            placeholder={tt('meeting-code')}
                                            value={info.meeting_code}
                                            className='py-1.5 px-2 outline-none border rounded-md'
                                            onChange={(e) => handleMeetinInfoChange(e, index)}
                                        />
                                        <button type='button' onClick={() => removeMeetingInfo(index)} className='bg-red-500 hover:bg-red-600 w-1/2 self-end text-white py-1.5 rounded-md outline-none'>{tt('remove')}</button>
                                    </div>
                                ))}
                                <button type='button' onClick={addMoreMeetingInfo} className='bg-blue-600 hover:bg-blue-500 py-1.5 rounded-md w-full text-white'>{tt('add-more')}</button>
                            </div>

                        </div>
                        <div className='flex flex-col gap-3'>
                            <span className='font-medium'>{t('supplier.tags')}</span>

                            <ul className='w-full flex items-center gap-5 flex-wrap'>
                                {formData.tags.map(item => (
                                    <li key={item} onClick={() => handleRemoveTag(item)} className='border cursor-pointer bg-slate-100 py-1 px-3 flex items-center gap-2'>
                                        <div>{item}</div>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </li>
                                ))}
                            </ul>

                        </div>
                        <div className='flex items-center gap-10 w-1/2 self-end'>
                            <Link href={'/manage/supplier'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('update')}</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Page 