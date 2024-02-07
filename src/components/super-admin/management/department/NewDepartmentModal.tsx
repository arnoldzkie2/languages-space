'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useGlobalStore from '@/lib/state/globalStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const NewDepartmentModal = () => {

  const { getDepartments, closeNewDepartment, newDepartment } = useDepartmentStore()
  const { setIsLoading, setErr } = useGlobalStore()
  const [name, setName] = useState('')

  const createDepartment = async (e: any) => {

    e.preventDefault()
    try {

      setIsLoading(true)
      const { data } = await axios.post('/api/department', { name })

      if (data.ok) {
        setIsLoading(false)
        setName('')
        toast("Success! department has been created.")
        closeNewDepartment()
        getDepartments()
      }

    } catch (error: any) {
      setIsLoading(false)
      if (error.response.data.msg) {
        return setErr(error.response.data.msg)
      }
      alert("Somethihng went wrong")
    }
  }

  const t = useTranslations('super-admin')

  const tt = useTranslations('global')
  if (!newDepartment) return null

  return (
    <div className='fixed top-0 left-0 flex items-center justify-center w-screen h-screen backdrop-blur-sm'>
      <Card>
        <CardHeader>
          <CardTitle>{t('department.create')}</CardTitle>
          <CardDescription><Err /></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createDepartment} className='relative w-full flex flex-col gap-5'>
            <Input required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Department Name'
            />
            <div className='flex w-full gap-5 items-center'>
              <Button type='button' variant={'ghost'} className='w-full' onClick={closeNewDepartment}>{tt('close')}</Button>
              <SubmitButton msg={tt('create')} style='w-full' />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewDepartmentModal