/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { newClientFormValue } from '@/lib/state/super-admin/clientStore'
import { ClientFormData } from '@/lib/types/super-admin/clientType'
import { UploadButton } from '@/utils/uploadthing'
import Image from 'next/image'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useGlobalStore from '@/lib/state/globalStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/global/SubmitButton'
import { Checkbox } from '@/components/ui/checkbox'
import Err from '@/components/global/Err'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { toast } from 'sonner'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const Page = () => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const router = useRouter()

    const [formData, setFormData] = useState<ClientFormData>(newClientFormValue)
    const { admin, isAdminAllowed } = useAdminPageStore()
    const { isSideNavOpen, setErr, setOkMsg, deleteProfile, prevProfileKey, setPrevProfileKey, setIsLoading } = useGlobalStore()
    const { departments, getDepartments, departmentID } = useDepartmentStore()
    const registerUser = async (e: React.FormEvent) => {

        e.preventDefault()
        const { username, password, departments } = formData
        if (password.length < 3) return setErr('Password minimum length 3')
        if (!username) return setErr('Username Cannot Be Empty')

        if (admin) {
            formData.departments = [departmentID]
        } else {
            if (departments.length < 1) return setErr("Select Department")
        }

        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/client', formData)

            if (data.ok) {
                setIsLoading(false)
                toast("Success! client created")
                router.push('/admin/manage/client')
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    };

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
        setPrevProfileKey('')
        if (!admin) getDepartments()
    }, [])

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
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('client.create')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                        <Link href={'/admin/manage/client'} className='flex items-center justify-center w-32 hover:hover:text-primary cursor-pointer gap-1'>
                            <div>{t('client.manage')}</div>
                        </Link>
                    </ul>
                </nav>

                <div className='w-full px-8'>

                    <Card className='w-[40%] h-full'>
                        <CardHeader>
                            <CardTitle>{t('client.create')}</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={registerUser} className='w-full flex flex-col'>
                                <Err />
                                <div className='w-full flex gap-20'>

                                    <div className='w-full flex flex-col gap-4'>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="name">{t("info.name")}</Label>
                                            <Input type="text" id="name" name='name' placeholder={t("info.name")} value={formData.name} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="username">{t("info.username")}</Label>
                                            <Input type="text" id="username" name='username' placeholder={t("info.username")} value={formData.username} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="email">{t("info.email.h1")}</Label>
                                            <Input type="email" id="email" name='email' placeholder={t("info.email.address")} value={formData.email} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="password">{t("info.password")}</Label>
                                            <Input type="text" id="password" name='password' placeholder={t("info.password")} value={formData.password} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="phone_number">{t("info.phone")}</Label>
                                            <Input type="number" id="phone_number" name='phone_number' placeholder={t("info.phone")} value={formData.phone_number} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="organization">{t("info.organization")}</Label>
                                            <Input type="text" id="organization" name='organization' placeholder={t("info.organization")} value={formData.organization} onChange={handleChange} />
                                        </div>

                                    </div>

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
                                                        <SelectItem value="female">{t('info.gender.female')}</SelectItem>
                                                        <SelectItem value="others">{t('info.gender.others')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="address">{t("info.address")}</Label>
                                            <Input type="text" id="address" name='address' placeholder={t("info.address")} value={formData.address} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="origin">{t("info.origin")}</Label>
                                            <Input type="text" id="origin" name='origin' placeholder={t("info.origin")} value={formData.origin} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="note">{t("info.note")}</Label>
                                            <Input type="text" id="note" name='note' placeholder={t("info.note")} value={formData.note} onChange={handleChange} />
                                        </div>

                                        {!admin && <div className='w-full flex flex-col gap-2'>
                                            <Label className='block font-medium'>{t('department.s')}</Label>
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
                                        }
                                        <div className='flex w-full justify-between gap-5 items-center'>

                                            <Image width={90} height={90} src={formData.profile_url || '/profile/profile.svg'} alt='Client Profile' className='rounded-full bg-foreground border' />

                                            <div className='flex flex-col gap-3'>
                                                <label className='block font-medium'>{t('profile.info')}</label>
                                                <UploadButton
                                                    appearance={
                                                        { button: 'bg-primary text-sm' }
                                                    }
                                                    endpoint="profileUploader"
                                                    onClientUploadComplete={async (res) => {
                                                        // Do something with the response
                                                        if (res) {
                                                            setFormData(prevState => ({ ...prevState, profile_url: res[0].url, profile_key: res[0].key }))
                                                            toast('Profile Changed')
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
                                <div className='flex items-center gap-10 w-1/2 self-end pt-5'>
                                    <Button variant={'ghost'} className='w-full' onClick={() => router.push('/admin/manage/client')} type='button'>{t('operation.cancel')}</Button>
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