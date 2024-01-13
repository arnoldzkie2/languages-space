/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { UploadButton } from '@/utils/uploadthing'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Department } from '@/lib/types/super-admin/globalType'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { useRouter } from '@/lib/navigation'
import SubmitButton from '@/components/global/SubmitButton'
import { adminFormDataValue } from '@/lib/state/super-admin/adminStore'
import { AdminFormDataValueProps } from '@/lib/types/super-admin/adminType'

const Page = () => {

    const router = useRouter()
    const [formData, setFormData] = useState<AdminFormDataValueProps>(adminFormDataValue)
    const { isSideNavOpen, departments, getDepartments, setIsLoading, setErr, prevProfileKey, setPrevProfileKey, deleteProfile } = useGlobalStore()

    const createAdmin = async (e: React.FormEvent) => {

        try {
            e.preventDefault()
            const { name, username, password } = formData

            if (!name || !password || !username) return setErr('Fill up some inputs')
            if (username.length < 3) return setErr('Username minimum length 3')
            if (password.length < 3) return setErr('Password minimum length 3')

            setIsLoading(true)
            const { data } = await axios.post('/api/admin', formData)

            if (data.ok) {
                setIsLoading(false)
                router.push('/manage/admin')
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

    useEffect(() => {
        setPrevProfileKey('')
        getDepartments()
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

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('admin.create')}</h1>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={createAdmin}>
                        <Err />
                        <div className='w-full flex gap-20'>

                            <SupplierFormFirstRow
                                formData={formData}
                                handleChange={handleChange} />

                            <SupplierFormSecondRow
                                formData={formData}
                                handleChange={handleChange}
                                departments={departments}
                                setFormData={setFormData}
                            />

                        </div>

                        <div className='flex items-center gap-10 w-1/2 self-end'>
                            <Link href={'/manage/admin'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
                            <SubmitButton msg={tt('create')} style='w-full bg-blue-600 py-1.5 rounded-md text-white' />
                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}


const SupplierFormFirstRow = (props: {
    formData: AdminFormDataValueProps,
    handleChange: (e: any) => void,
}) => {

    const { formData, handleChange } = props
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

        </div>
    )
}

const SupplierFormSecondRow = (props: {
    handleChange: (e: any) => void
    formData: AdminFormDataValueProps
    departments: Department[]
    setFormData: React.Dispatch<React.SetStateAction<AdminFormDataValueProps>>
}) => {

    const { handleChange, formData, departments, setFormData } = props

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
                <label htmlFor="address" className='font-medium text-gray-700'>{tt('address')} {tt('optional')}</label>
                <input value={formData.address} onChange={handleChange} name='address' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='address' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="origin" className='font-medium text-gray-700'>{tt('origin')} {tt('optional')}</label>
                <input value={formData.origin} onChange={handleChange} name='origin' type="text" className='w-full border outline-none rounded-sm focus:shadow-blue-500 shadow py-1 px-3' id='origin' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label className='block font-medium text-gray-700'>{tt('departments')}</label>
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


export default Page