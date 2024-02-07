
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { UploadButton } from '@/utils/uploadthing'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { AgentFormDataValueProps } from '@/lib/types/super-admin/agentType'
import { useRouter } from '@/lib/navigation'
import { agentFormDataValue } from '@/lib/state/super-admin/agentStore'
import SubmitButton from '@/components/global/SubmitButton'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { Department } from '@prisma/client'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

interface Props {
  params: {
    agentID: string
  }
}

const Page = ({ params }: Props) => {

  const agentID = params.agentID
  const router = useRouter()
  const [formData, setFormData] = useState<AgentFormDataValueProps>(agentFormDataValue)
  const { isSideNavOpen, setIsLoading, setErr, prevProfileKey, setPrevProfileKey, deleteProfile } = useGlobalStore()
  const { departments, getDepartments, departmentID } = useDepartmentStore()
  const admin = useAdminPageStore(s => s.admin)

  const updateAgent = async (e: React.FormEvent) => {

    try {
      e.preventDefault()
      const { username, password, payment_address, currency, departments } = formData

      if (!password || !username) return setErr('Fill up some inputs')
      if (username.length < 3) return setErr('Username minimum length 3')
      if (password.length < 3) return setErr('Password minimum length 3')
      if (!payment_address) return setErr('Payment Address is required')
      if (!currency) return setErr('Currency is required')
      if (admin) {
        formData.departments = [departmentID]
      } else {
        if (departments.length < 1) return setErr("Select Department")
      }

      setIsLoading(true)
      const { data } = await axios.patch('/api/agent', formData, { params: { agentID } })

      if (data.ok) {
        setIsLoading(false)
        toast("Success! Agent updated.")
        router.push('/admin/manage/agent')
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

  const retrieveAgent = async () => {
    try {
      const { data } = await axios.get("/api/agent", { params: { agentID } })
      if (data.ok) {
        const departmentIDs = data.data.departments.length > 0 ? data.data.departments.map((dept: Department) => dept.id) : []
        data.data.departments = departmentIDs
        const { commission_type, currency, payment_address, commission_rate } = data.data.balance[0]
        data.data.commission_type = commission_type
        data.data.currency = currency
        data.data.payment_address = payment_address
        data.data.commission_rate = commission_rate
        setFormData(data.data)
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    retrieveAgent()
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

  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  return (
    <>

      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
          <h1 className='font-black text-xl uppercase'>{t('agent.update')}</h1>
        </nav>

        <div className='w-full px-8'>

          <Card className='w-2/5'>
            <CardHeader>
              <CardTitle>{t('agent.update')}</CardTitle>
              <CardDescription><Err /></CardDescription>
            </CardHeader>
            <CardContent>
              <form className='w-full flex flex-col' onSubmit={updateAgent}>
                <div className='w-full flex gap-20'>

                  <SupplierFormFirstRow
                    formData={formData}
                    handleChange={handleChange} />

                  <SupplierFormSecondRow
                    formData={formData}
                    handleCheckboxChange={handleCheckboxChange}
                    handleChange={handleChange}
                    departments={departments}
                    setFormData={setFormData}
                  />

                </div>

                <div className='flex items-center gap-10 mt-10 w-1/2 self-end'>
                  <Button type='button' onClick={() => router.push('/admin/manage/agent')} variant={'ghost'} className='w-full'>{tt('cancel')}</Button>
                  <SubmitButton msg={tt('update')} style='w-full' />
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
  formData: AgentFormDataValueProps,
  handleChange: (e: any) => void,
}) => {

  const { formData, handleChange } = props
  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  return (
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="note">{tt("note")}</Label>
        <Input type="text" id="note" name='note' placeholder={tt("note")} value={formData.note} onChange={handleChange} />
      </div>

    </div>
  )
}

const SupplierFormSecondRow = (props: {
  handleChange: (e: any) => void
  formData: AgentFormDataValueProps
  handleCheckboxChange: (isChecked: boolean, deptId: string) => void
  departments: Department[] | null
  setFormData: React.Dispatch<React.SetStateAction<AgentFormDataValueProps>>
}) => {

  const { handleChange, formData, departments, setFormData, handleCheckboxChange } = props
  const admin = useAdminPageStore(s => s.admin)

  const tt = useTranslations('global')
  return (
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

      <div className='flex w-full items-center gap-2'>

        <div className="w-full items-center gap-1.5">
          <Label>{tt('currency')}</Label>
          <Select onValueChange={(currency) => setFormData(prev => ({ ...prev, currency }))} value={formData.currency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tt('select')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{tt('currency')}</SelectLabel>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="PHP">PHP (₱)</SelectItem>
                <SelectItem value="RMB">RMB (¥)</SelectItem>
                <SelectItem value="VND">VND (₫)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className='w-full flex flex-col gap-2'>

        <Label>{tt('commission-rate')}</Label>
        <div className='flex items-center gap-5 w-full relative'>
          <div className="w-1/2 items-center gap-1.5">
            <Select onValueChange={(commission_type) => setFormData(prev => ({ ...prev, commission_type }))} value={formData.commission_type}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tt('select')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{tt('type')}</SelectLabel>
                  <SelectItem value="fixed">{tt('fixed')}</SelectItem>
                  <SelectItem value="percentage">{tt('percentage')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className={`absolute right-1 bg-card px-4 py-0.5 top-1 ${formData.commission_type === 'percentage' ? 'flex' : 'hidden'}`}>%</div>
          <Input value={formData.commission_rate}
            onChange={handleChange} name='commission_rate' type="number" id='commission_rate' />
        </div>

      </div>
      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="payment_info">{tt('payment-address')}</Label>
        <Input value={formData.payment_address} onChange={handleChange} name='payment_address' type="text" id='payment_address' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="address">{tt('address')} {tt('optional')}</Label>
        <Input value={formData.address} onChange={handleChange} name='address' type="text" id='address' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="origin">{tt('origin')} {tt('optional')}</Label>
        <Input value={formData.origin} onChange={handleChange} name='origin' type="text" id='origin' />
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

      <div className='flex items-center justify-between w-full mt-2'>

        <Image width={110} height={110} src={formData.profile_url || '/profile/profile.svg'} alt='Supplier Profile' className='border rounded-full' />

        <div className='flex flex-col gap-3 items-start'>
          <span className='block'>{tt('profile')}</span>
          <UploadButton
            appearance={{
              button: 'bg-primary text-muted'
            }}
            endpoint="profileUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                setFormData(prevData => ({ ...prevData, profile_key: res[0].key, profile_url: res[0].url }))
                toast("Upload Completed");
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