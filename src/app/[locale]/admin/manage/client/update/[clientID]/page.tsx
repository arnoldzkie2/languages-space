/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { newClientFormValue } from '@/lib/state/super-admin/clientStore'
import { ClientFormData } from '@/lib/types/super-admin/clientType'
import { Department } from '@/lib/types/super-admin/globalType'
import { UploadButton } from '@/utils/uploadthing'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import useGlobalStore from '@/lib/state/globalStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Err from '@/components/global/Err'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import SubmitButton from '@/components/global/SubmitButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@/lib/navigation'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { toast } from 'sonner'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

interface Props {
    params: {
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const clientID = params.clientID

    const router = useRouter()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const [formData, setFormData] = useState<ClientFormData>(newClientFormValue)
    const { admin, isAdminAllowed } = useAdminPageStore()
    const { isSideNavOpen, setErr, setIsLoading, setOkMsg } = useGlobalStore()
    const { departments, getDepartments, departmentID } = useDepartmentStore()

    const updateClient = async (e: React.FormEvent) => {

        e.preventDefault()

        const { username, password, departments } = formData

        if (!password || !username) return setErr('Fill up some inputs')
        if (username.length < 3) return setErr('Username minimum length 3')
        if (password.length < 3) return setErr('Password minimum length 3')
        if (admin) {
            formData.departments = [departmentID]
        } else {
            if (departments.length < 1) return setErr("Select Department")
        }
        try {

            setIsLoading(true)

            const { data } = await axios.patch(`/api/client?clientID=${clientID}`, formData)

            if (data.ok) {
                setIsLoading(false)
                toast("Success! client updated.")
                router.push('/admin/manage/client')

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

    const getClient = async () => {

        try {

            const { data } = await axios.get(`/api/client?clientID=${clientID}`)
            if (data.ok) {
                const departmentIDs = data.data.departments.map((department: Department) => department.id)
                data.data.departments = departmentIDs
                setFormData(data.data)
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    useEffect(() => {
        getClient()
        if (!admin) getDepartments()
    }, [])

    return (
        <div className=''>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-foreground text-xl uppercase'>{t('client.update')}</h1>
                    <Link href={'/admin/manage/client'}>{t('client.h1')}</Link>
                </nav>

                <div className='w-full px-8'>

                    <Card className='w-[40%] h-full'>
                        <CardHeader>
                            <CardTitle>{t('client.update')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updateClient} className='w-full flex flex-col'>
                                <div className='w-full flex gap-20'>

                                    <div className='w-full flex flex-col gap-4'>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="name">{tt("name")}</Label>
                                            <Input type="text" id="name" name='name' placeholder={tt("name")} value={formData.name} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="username">{tt("username")}</Label>
                                            <Input type="text" id="username" name='username' placeholder={tt("username")} value={formData.username} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="email">{tt("email")}</Label>
                                            <Input type="email" id="email" name='email' placeholder={tt("email")} value={formData.email} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="password">{tt("password")}</Label>
                                            <Input type="text" id="password" name='password' placeholder={tt("password")} value={formData.password} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="phone_number">{tt("phone")}</Label>
                                            <Input type="number" id="phone_number" name='phone_number' placeholder={tt("phone")} value={formData.phone_number} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="organization">{tt("organization")}</Label>
                                            <Input type="text" id="organization" name='organization' placeholder={tt("organization")} value={formData.organization} onChange={handleChange} />
                                        </div>

                                    </div>

                                    <div className='w-full flex flex-col gap-4'>

                                        <div className="w-full items-center gap-1.5">
                                            <Label>{tt('gender')}</Label>
                                            <Select onValueChange={(gender) => setFormData(prev => ({ ...prev, gender }))} value={formData.gender}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={tt('select-gender')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{tt('gender')}</SelectLabel>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="others">Others</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="address">{tt("address")}</Label>
                                            <Input type="text" id="address" name='address' placeholder={tt("address")} value={formData.address} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="origin">{tt("origin")}</Label>
                                            <Input type="text" id="origin" name='origin' placeholder={tt("origin")} value={formData.origin} onChange={handleChange} />
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="note">{tt("note")}</Label>
                                            <Input type="text" id="note" name='note' placeholder={tt("note")} value={formData.note} onChange={handleChange} />
                                        </div>

                                        {!admin && <div className='w-full flex flex-col gap-2'>
                                            <Label className='block font-medium'>{tt('departments')}</Label>
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
                                        </div>}

                                        <div className='flex w-full justify-between gap-5 items-center'>

                                            <Image width={90} height={90} src={formData.profile_url || '/profile/profile.svg'} alt='Client Profile' className='rounded-full bg-foreground border' />

                                            <div className='flex flex-col gap-3'>
                                                <label className='block font-medium'>{tt('profile')}</label>
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
                                    <Button variant={'ghost'} className='w-full' onClick={() => router.push('/admin/manage/client')} type='button'>{tt('cancel')}</Button>
                                    <SubmitButton msg={tt('update')} style='w-full' />
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