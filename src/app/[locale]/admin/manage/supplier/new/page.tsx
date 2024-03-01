/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import { supplierFormDataValue } from '@/lib/state/super-admin/supplierStore'
import { SupplierFormDataProps } from '@/lib/types/super-admin/supplierTypes'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { useRouter } from '@/lib/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/global/SubmitButton'
import { toast } from 'sonner'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import SupplierFormFirstRow from '@/components/super-admin/management/supplier/form/SupplierFormFirstRow'
import SupplierFormSecondRow from '@/components/super-admin/management/supplier/form/SupplierFormSecondRow'
import SupplierFormThirdRow from '@/components/super-admin/management/supplier/form/SupplierFormThirdRow'

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
    const { name, username, password, payment_address, currency, booking_rate, departments } = updatedFormData

    try {

      if (!name || !password || !username) return setErr('Fill up some inputs')
      if (username.length < 3) return setErr('Username minimum length 3')
      if (password.length < 3) return setErr('Password minimum length 3')
      if (!payment_address) return setErr('Payment Address is required')
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

  const t = useTranslations()

  return (
    <>

      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
          <h1 className='font-black text-xl uppercase'>{t('supplier.create')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
            <Link href={'/admin/manage/supplier'} className='flex items-center justify-center w-44 hover:text-primary cursor-pointer'>
              {t('supplier.manage')}
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
                  <Button variant={'ghost'} type='button' className='w-full' onClick={() => router.push('/admin/manage/supplier')}>{t('operation.cancel')}</Button>
                  <SubmitButton msg={t('operation.create')} style='w-full' />
                </div>
              </form>
            </CardContent>
          </Card>


        </div>

      </div>
    </>
  )
}

export default Page