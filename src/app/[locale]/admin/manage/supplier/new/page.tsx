/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { supplierFormDataValue } from '@/lib/state/super-admin/supplierStore'
import { SupplierFormDataProps } from '@/lib/types/super-admin/supplierTypes'
import { UploadButton } from '@/utils/uploadthing'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { useRouter } from '@/lib/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/global/SubmitButton'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { Department } from '@prisma/client'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const Page = () => {

  const router = useRouter()
  const [formData, setFormData] = useState<SupplierFormDataProps>(supplierFormDataValue)

  const { isSideNavOpen, setIsLoading, setErr, prevProfileKey, setPrevProfileKey, deleteProfile } = useGlobalStore()
  const { departments, getDepartments, departmentID } = useDepartmentStore()
  const admin = useAdminPageStore(s => s.admin)
  const registerSupplier = async (e: React.FormEvent) => {

    e.preventDefault()

    const { meeting_info } = formData;
    const filteredMeetingInfo = meeting_info.filter(info =>
      info.service.trim() !== '' && info.meeting_code.trim() !== ''
    );

    const updatedFormData = { ...formData, meeting_info: filteredMeetingInfo };
    const { name, username, password, payment_address, payment_schedule, currency, booking_rate, departments } = updatedFormData

    try {

      if (!name || !password || !username) return setErr('Fill up some inputs')
      if (username.length < 3) return setErr('Username minimum length 3')
      if (password.length < 3) return setErr('Password minimum length 3')
      if (!payment_address) return setErr('Payment Address is required')
      if (!payment_schedule) return setErr('Payment Scheudule is required')
      if (!currency) return setErr('Currency is required')
      if (!booking_rate) return setErr("Boooking Rate is required")

      if (admin) {
        updatedFormData.departments = [departmentID]
      } else {
        if (departments.length < 1) return setErr("Select Department")
      }

      setIsLoading(true)
      const { data } = await axios.post('/api/supplier', updatedFormData)

      if (data.ok) {
        setIsLoading(false)
        toast("Success! supplier has been created.")
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
        event.currentTarget.value = ''; // Clear the Input
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

  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  return (
    <>

      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
          <h1 className='font-black text-xl uppercase'>{t('supplier.create')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
            <Link href={'/admin/manage/supplier'} className='flex items-center justify-center w-44 hover:text-primary cursor-pointer'>
              {t('supplier.h1')}
            </Link>
          </ul>
        </nav>

        <div className='w-full px-8'>

          <Card className='w-2/3'>
            <CardHeader>
              <CardTitle>{t('supplier.create')}</CardTitle>
              <CardDescription><Err /></CardDescription>
            </CardHeader>
            <CardContent>
              <form className='w-full flex flex-col gap-10' onSubmit={registerSupplier}>
                <div className='w-full flex gap-20'>

                  <SupplierFormFirstRow formData={formData}
                    handleChange={handleChange}
                    handleRemoveTag={handleRemoveTag}
                    handleTagInputChange={handleTagInputChange} />

                  <SupplierFormSecondRow formData={formData}
                    handleChange={handleChange}
                    departments={departments}
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
                  <Button variant={'ghost'} type='button' className='w-full' onClick={() => router.push('/admin/manage/supplier')}>{tt('cancel')}</Button>
                  <SubmitButton msg={tt('create')} style='w-full' />
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
        <Label htmlFor="name">{tt('name')}</Label>
        <Input required value={formData.name} onChange={handleChange} name='name' type="text" id='name' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="username">{tt('username')}</Label>
        <Input required value={formData.username} onChange={handleChange} name='username' type="text" id='username' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="email">{tt('email')} (optional)</Label>
        <Input value={formData.email} onChange={handleChange} name='email' type="email" id='email' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="password">{tt('password')}</Label>
        <Input required value={formData.password} onChange={handleChange} name='password' type="text" id='password' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="phone">{tt('phone')} (optional)</Label>
        <Input value={formData.phone_number} onChange={handleChange} name='phone_number' type="text" id='phone' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="organization">{tt('organization')} (optional)</Label>
        <Input value={formData.organization} onChange={handleChange} name='organization' type="text" id='organization' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="note">{tt('note')} (optional)</Label>
        <Input value={formData.note} onChange={handleChange} name='note' type="text" id='note' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="tags" title='Enter to add tags'>{t('supplier.tags')} (optional)</Label>
        <Input onKeyDown={handleTagInputChange} name='tags' type="text" id='tags' />
      </div>

      <div className='flex flex-col gap-3'>
        <span>{t('supplier.tags')}</span>

        <ul className='w-full flex items-center gap-5 flex-wrap'>
          {formData.tags.map(item => (
            <li key={item} onClick={() => handleRemoveTag(item)} className='border cursor-pointer bg-muted py-1 px-3 flex items-center gap-2'>
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
  departments: Department[] | null
  setFormData: React.Dispatch<React.SetStateAction<SupplierFormDataProps>>
}) => {

  const { handleChange, formData, departments, setFormData } = props

  const admin = useAdminPageStore(s => s.admin)

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

  const tt = useTranslations('global')
  return (
    <div className='w-full flex flex-col gap-4'>


      <div className="w-full items-center gap-1.5">
        <Label>{tt('gender')}</Label>
        <Select onValueChange={(gender) => setFormData(prev => ({ ...prev, gender }))} value={formData.gender}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={tt('select')} />
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

      <div className="w-full items-center gap-1.5">
        <Label>{tt('employment')}</Label>
        <Select onValueChange={(employment_status) => setFormData(prev => ({ ...prev, employment_status }))} value={formData.employment_status}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={tt('select')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{tt('employment')}</SelectLabel>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex w-full items-center gap-2'>

        <div className="w-full items-center gap-1.5">
          <Label>{tt('payment')}</Label>
          <Select onValueChange={(payment_schedule) => setFormData(prev => ({ ...prev, payment_schedule }))} value={formData.payment_schedule}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tt('select')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{tt('payment')}</SelectLabel>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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
        <Label htmlFor="salary">{tt('salary')} {tt('optional')}</Label>
        <Input value={props.formData.salary} onChange={props.handleChange} name='salary' type="number" id='salary' />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label htmlFor="booking_rate">{tt('booking-rate')}</Label>
        <Input value={props.formData.booking_rate} onChange={props.handleChange} name='booking_rate' type="number" id='booking_rate' />
      </div>

      <h1 className='font-bold'>{tt('meeting')}</h1>
      {props.meetingInfo.map((info, index) => (
        <div key={index} className='flex flex-col gap-3 w-full p-4 border'>
          <Input
            type="text"
            name="service"
            placeholder={tt('service')}
            value={info.service}
            onChange={(e) => props.handleMeetinInfoChange(e, index)}
          />
          <Input
            type="text"
            name="meeting_code"
            placeholder={tt('meeting-code')}
            value={info.meeting_code}
            onChange={(e) => props.handleMeetinInfoChange(e, index)}
          />
          <Button type='button' onClick={() => props.removeMeetingInfo(index)} className='w-full' variant={'destructive'}>{tt('remove')}</Button>
        </div>
      ))}
      <Button type='button' onClick={props.addMoreMeetingInfo} className='w-1/2 self-end mt-3' >{tt("add-more")}</Button>
    </div>
  )
}

export default Page