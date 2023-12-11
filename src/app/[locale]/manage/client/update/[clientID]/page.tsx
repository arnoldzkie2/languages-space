/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { newClientFormValue } from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { ClientFormData } from '@/lib/types/super-admin/clientType'
import { Department } from '@/lib/types/super-admin/globalType'
import { UploadButton } from '@/utils/uploadthing'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface Props {
    params: {
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const clientID = params.clientID

    const session: any = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const router = useRouter()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const [formData, setFormData] = useState<ClientFormData>(newClientFormValue)

    const { isSideNavOpen, departments, getDepartments, err, setErr, isLoading, setIsLoading, okMsg, setOkMsg } = useAdminGlobalStore()

    const registerUser = async (e: any) => {

        e.preventDefault()

        const { username, password } = formData

        if (!password || !username) return setErr('Fill up some inputs')
        if (username.length < 3) return setErr('Username minimum length 3')
        if (password.length < 3) return setErr('Password minimum length 3')

        try {

            setIsLoading(true)

            const { data } = await axios.patch(`/api/client?clientID=${clientID}`, formData)

            if (data.ok) {
                setIsLoading(false)
                router.push('/manage/client')

            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            setErr('Something went wrong')
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

        const getUser = async () => {

            try {

                const { data } = await axios.get(`/api/client?clientID=${clientID}`)


                if (data.ok) {

                    const departmentIDs = data.data.departments.map((department: Department) => department.id);
                    data.data.departments = departmentIDs
                    setFormData(data.data)

                }

            } catch (error) {

                console.log(error);

            }
        }

        getDepartments()

        getUser()
    }, [])


    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client.create')}</h1>
                </nav>

                <div className='w-full px-8'>

                    <form className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={registerUser}>
                        {err && <small className='w-full text-red-400'>{err}</small>
                        }
                        <div className='w-full flex gap-20'>

                            <div className='w-full flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="name" className='font-medium px-2'>{tt('name')}</label>
                                    <input required value={formData.name} onChange={handleChange} name='name' type="text" className='w-full border outline-none py-1 px-3' id='name' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="username" className='font-medium px-2'>{tt('username')}</label>
                                    <input required value={formData.username} onChange={handleChange} name='username' type="text" className='w-full border outline-none py-1 px-3' id='username' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="email" className='font-medium px-2'>{tt('email')} {tt('optional')}</label>
                                    <input value={formData.email} onChange={handleChange} name='email' type="text" className='w-full border outline-none py-1 px-3' id='email' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="password" className='font-medium px-2'>{tt('password')}</label>
                                    <input required value={formData.password} onChange={handleChange} name='password' type="text" className='w-full border outline-none py-1 px-3' id='password' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="phone" className='font-medium px-2'>{tt('phone')} {tt('optional')}</label>
                                    <input value={formData.phone_number} onChange={handleChange} name='phone_number' type="text" className='w-full border outline-none py-1 px-3' id='phone' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="organization" className='font-medium px-2'>{tt('organization')} {tt('optional')}</label>
                                    <input value={formData.organization} onChange={handleChange} name='organization' type="text" className='w-full border outline-none py-1 px-3' id='organization' />
                                </div>

                            </div>

                            <div className='w-full flex flex-col gap-4'>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="gender" className='font-medium px-2'>{tt('gender')} {tt('optional')}</label>
                                    <select name="gender" id="gender" onChange={handleChange} value={formData.gender} className='py-1 outline-none px-3 border'>
                                        <option value="" disabled>{tt('select-gender')}</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="address" className='font-medium px-2'>{tt('address')} {tt('optional')}</label>
                                    <input value={formData.address} onChange={handleChange} name='address' type="text" className='w-full border outline-none py-1 px-3' id='address' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="origin" className='font-medium px-2'>{tt('origin')} {tt('optional')}</label>
                                    <input value={formData.origin} onChange={handleChange} name='origin' type="text" className='w-full border outline-none py-1 px-3' id='origin' />
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="note" className='font-medium px-2'>{tt('note')} {tt('optional')}</label>
                                    <input value={formData.note} onChange={handleChange} name='note' type="text" className='w-full border outline-none py-1 px-3' id='note' />
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

                                <div className='flex w-full justify-around items-center'>

                                    <Image width={120} height={120} src={formData.profile_url || '/profile/profile.svg'} alt='Client Profile' className='rounded-full border' />

                                    <div className='flex flex-col gap-3'>
                                        <label className='block font-medium'>{tt('profile')}</label>
                                        <UploadButton
                                            endpoint="profileUploader"
                                            onClientUploadComplete={async (res) => {
                                                // Do something with the response
                                                if (res) {

                                                    const { data } = await axios.post('/api/uploadthing/profile/change/client', {
                                                        profile: res[0], clientID: formData.id
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
                                                setErr('Something went wrong.')

                                            }}
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className='flex items-center gap-10 w-1/2 self-end'>
                            <Link href={'/manage/client'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
                            <button disabled={isLoading && true} className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('update')}</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Page