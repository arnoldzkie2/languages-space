/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { OurFileRouter } from '@/app/api/uploadthing/core'
import SideNav from '@/components/super-admin/SideNav'
import { newClientFormValue } from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { ClientFormData } from '@/lib/types/super-admin/clientType'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploadButton } from '@uploadthing/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const router = useRouter()

    const session = useSession()

    const t = useTranslations('super-admin')

    const [formData, setFormData] = useState<ClientFormData>(newClientFormValue)

    const { isSideNavOpen, departments, getDepartments } = useAdminGlobalStore()

    const [isLoading, setIsLoading] = useState(false)

    const [err, setErr] = useState('')

    const registerUser = async (e: any) => {

        e.preventDefault()

        const { name, user_name, password } = formData

        if (!name || !password || !user_name) return setErr('Fill up some inputs')

        if (user_name.length < 3) return setErr('Username minimum length 3')

        if (password.length < 3) return setErr('Password minimum length 3')

        try {

            setIsLoading(true)

            const { data } = await axios.post('/api/client', formData)

            if (data.ok) {

                setIsLoading(false)

                router.push('/manage/client')

            }

        } catch (error: any) {

            setIsLoading(false)

            console.log(error);

            if (error.response.data.msg === 'user_name_exist') {

                return setErr('Username already exist!')

            }

            return setErr('Something went wrong')

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
            updatedFormData[name] = value; // Use a type assertion for the key
        }

        setFormData(updatedFormData)

    };

    useEffect(() => {

        getDepartments()

    }, [])

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 w-32 h-5 rounded-3xl animate-pulse'></li>
    )
    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client.create')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {session.status !== 'loading' ?
                            <Link href={'/manage/client'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('client.h1')}</div>
                            </Link> : clientHeaderSkeleton}
                        {session.status !== 'loading' ?
                            <Link href={'/manage/client/card'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('client-card.h1')}</div>
                            </Link> : clientHeaderSkeleton}
                        {session.status !== 'loading' ? <Link href={'/manage/client/card/bind'} className='flex items-center gap-1 text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer'>
                            <div>{t('client.card.bind')}</div>
                        </Link> : clientHeaderSkeleton}
                    </ul>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={registerUser}>
                        {err && <small className='w-full text-red-400'>{err}</small>
                        }
                        <div className='w-full flex gap-20'>

                            <div className='w-full flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="name" className='font-medium px-2'>Full Name</label>
                                    <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none py-1 px-3' id='name' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="username" className='font-medium px-2'>Username</label>
                                    <input required value={formData.user_name} onChange={handleChange} name='user_name' type="text" className='w-full border outline-none py-1 px-3' id='username' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="email" className='font-medium px-2'>Email (optional)</label>
                                    <input value={formData.email} onChange={handleChange} name='email' type="text" className='w-full border outline-none py-1 px-3' id='email' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="password" className='font-medium px-2'>Password</label>
                                    <input required value={formData.password} onChange={handleChange} name='password' type="text" className='w-full border outline-none py-1 px-3' id='password' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="phone" className='font-medium px-2'>Phone (optional)</label>
                                    <input value={formData.phone_number} onChange={handleChange} name='phone_number' type="text" className='w-full border outline-none py-1 px-3' id='phone' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="organization" className='font-medium px-2'>Organization (optional)</label>
                                    <input value={formData.organization} onChange={handleChange} name='organization' type="text" className='w-full border outline-none py-1 px-3' id='organization' />
                                </div>

                            </div>

                            <div className='w-full flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="gender" className='font-medium px-2'>Gender (optional)</label>
                                    <select name="gender" id="gender" onChange={handleChange} value={formData.gender} className='py-1 outline-none px-3 border'>
                                        <option value="" disabled>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="address" className='font-medium px-2'>Address (optional)</label>
                                    <input value={formData.address} onChange={handleChange} name='address' type="text" className='w-full border outline-none py-1 px-3' id='address' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="origin" className='font-medium px-2'>Origin (optional)</label>
                                    <input value={formData.origin} onChange={handleChange} name='origin' type="text" className='w-full border outline-none py-1 px-3' id='origin' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="note" className='font-medium px-2'>Note (optional)</label>
                                    <input value={formData.note} onChange={handleChange} name='note' type="text" className='w-full border outline-none py-1 px-3' id='note' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label className='block font-medium'>Departments</label>
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

                                <div className='flex flex-col gap-3 items-start'>
                                    <span className='block font-medium'>Profile Image</span>
                                    <UploadButton<OurFileRouter>
                                        endpoint="profileUploader"
                                        onClientUploadComplete={(res) => {

                                            // Do something with the response
                                            if (res) {

                                                setFormData(prevData => ({ ...prevData, profile: res[0].url }))
                                                alert("Upload Completed");

                                            }

                                        }}
                                        onUploadError={(error: Error) => {

                                            alert('Something went wrong.')

                                            // Do something with the error.
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className='flex items-center gap-10 w-1/2 self-end'>
                            <Link href={'/manage/client'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>Cancel</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : 'Create'}</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Page