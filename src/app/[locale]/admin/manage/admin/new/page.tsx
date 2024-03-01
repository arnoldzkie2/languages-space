/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { UploadButton } from '@/utils/uploadthing'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { useRouter } from '@/lib/navigation'
import SubmitButton from '@/components/global/SubmitButton'
import { adminFormDataValue } from '@/lib/state/super-admin/adminStore'
import { AdminFormDataValueProps } from '@/lib/types/super-admin/adminType'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Department } from '@prisma/client'

const Page = () => {

    const router = useRouter()
    const [formData, setFormData] = useState<AdminFormDataValueProps>(adminFormDataValue)
    const { isSideNavOpen, setIsLoading, setErr, prevProfileKey, setPrevProfileKey, deleteProfile } = useGlobalStore()
    const { departments, getDepartments } = useDepartmentStore()
    const createAdmin = async (e: React.FormEvent) => {

        try {
            e.preventDefault()
            const { name, username, password, departments } = formData

            if (!name || !password || !username) return setErr('Fill up some inputs')
            if (username.length < 3) return setErr('Username minimum length 3')
            if (password.length < 3) return setErr('Password minimum length 3')
            if (departments.length < 1) return setErr("Select Department")
            setIsLoading(true)
            const { data } = await axios.post('/api/admin', formData)

            if (data.ok) {
                setIsLoading(false)
                toast("Success! Admin created.")
                router.push('/admin/manage/admin')
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


    const handleCheckboxChange = (isChecked: boolean, deptId: string) => {
        if (isChecked) {
            // If checkbox is checked, add deptId to formData.departments
            setFormData(prevState => ({
                ...prevState,
                departments: [...prevState.departments, deptId]
            }));
        } else {
            // If checkbox is unchecked, remove deptId from formData.departments
            setFormData(prevState => ({
                ...prevState,
                departments: prevState.departments.filter(id => id !== deptId)
            }));
        }
    };

    useEffect(() => {

        if (prevProfileKey) {
            deleteProfile(prevProfileKey)
            setPrevProfileKey(formData.profile_key)
        } else {
            setPrevProfileKey(formData.profile_key)
        }

    }, [formData.profile_key])

    const t = useTranslations()

    return (
        <>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-16 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('admin.create')}</h1>
                </nav>

                <div className='w-full px-8'>

                    <Card className='w-2/5'>
                        <CardHeader>
                            <CardTitle>{t('admin.create')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='w-full flex flex-col gap-10' onSubmit={createAdmin}>
                                <div className='w-full flex gap-20'>

                                    <SupplierFormFirstRow
                                        formData={formData}
                                        handleChange={handleChange} />

                                    <SupplierFormSecondRow
                                        handleCheckboxChange={handleCheckboxChange}
                                        formData={formData}
                                        handleChange={handleChange}
                                        departments={departments}
                                        setFormData={setFormData}
                                    />

                                </div>

                                <div className='flex items-center gap-10 w-1/2 self-end'>
                                    <Button type='button' variant={'ghost'} onClick={() => router.push('/admin/manage/admin')} className='w-full'> {t('operation.cancel')}</Button>
                                    <SubmitButton style='w-full' msg={t('operation.create')} />
                                </div>
                            </form>
                        </CardContent>
                    </Card>



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
    const t = useTranslations()

    return (
        <div className='w-full flex flex-col gap-4'>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="name">{t('info.name')}</Label>
                <Input required value={formData.name} onChange={handleChange} name='name' type="text" id='name' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="username">{t('info.username')}</Label>
                <Input required value={formData.username} onChange={handleChange} name='username' type="text" id='username' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="email">{t('info.email.address')} {t('global.optional')}</Label>
                <Input value={formData.email} onChange={handleChange} name='email' type="email" id='email' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="password">{t('info.password')}</Label>
                <Input required value={formData.password} onChange={handleChange} name='password' type="text" id='password' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="phone">{t('info.phone')} {t('global.optional')}</Label>
                <Input value={formData.phone_number} onChange={handleChange} name='phone_number' type="text" id='phone' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="organization">{t('info.organization')} {t('global.optional')}</Label>
                <Input value={formData.organization} onChange={handleChange} name='organization' type="text" id='organization' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="note">{t('info.note')} {t('global.optional')}</Label>
                <Input value={formData.note} onChange={handleChange} name='note' type="text" id='note' />
            </div>

        </div>
    )
}

const SupplierFormSecondRow = (props: {
    handleChange: (e: any) => void
    formData: AdminFormDataValueProps
    departments: Department[] | null
    setFormData: React.Dispatch<React.SetStateAction<AdminFormDataValueProps>>
    handleCheckboxChange: (isChecked: boolean, deptId: string) => void
}) => {

    const { handleChange, formData, departments, setFormData, handleCheckboxChange } = props

    const t = useTranslations()

    return (
        <div className='w-full flex flex-col gap-4'>

            <div className="w-full items-center gap-1.5">
                <Label>{t('info.gender.h1')}</Label>
                <Select onValueChange={(gender) => setFormData(prev => ({ ...prev, gender }))} value={formData.gender}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('info.gender.select')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t('info.gender.select')}</SelectLabel>
                            <SelectItem value="male">{t('info.gender.male')}</SelectItem>
                            <SelectItem value="female">{t("info.gender.female")}</SelectItem>
                            <SelectItem value="others">{t("info.gender.others")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="address">{t('info.address')} {t('global.optional')}</Label>
                <Input value={formData.address} onChange={handleChange} name='address' type="text" id='address' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="origin">{t('info.origin')} {t('global.optional')}</Label>
                <Input value={formData.origin} onChange={handleChange} name='origin' type="text" id='origin' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label>{t('department.s')}</Label>
                {departments && departments.map((dept) => (
                    <div key={dept.id} className="flex items-center">
                        <Checkbox
                            onCheckedChange={(isChecked: boolean) => handleCheckboxChange(isChecked, dept.id)}
                            id={`department_${dept.id}`}
                            name={`department_${dept.id}`}
                            value={dept.id}
                            checked={formData.departments.includes(dept.id)}
                            className="mr-2"
                        />
                        <Label htmlFor={`department_${dept.id}`} className="mr-4">{dept.name}</Label>
                    </div>
                ))}
            </div>
            <div className='flex items-center justify-between w-full mt-2'>

                <Image width={110} height={110} src={formData.profile_url || '/profile/profile.svg'} alt='Supplier Profile' className='border rounded-full' />

                <div className='flex flex-col gap-3 items-start'>
                    <span>{t('profile.info')}</span>
                    <UploadButton
                        appearance={{
                            button: 'bg-primary text-secondary'
                        }}
                        endpoint="profileUploader"
                        onClientUploadComplete={(res) => {
                            if (res) {
                                setFormData(prevData => ({ ...prevData, profile_key: res[0].key, profile_url: res[0].url }))
                                toast("Success! Profile changed");
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