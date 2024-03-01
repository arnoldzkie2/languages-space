'use client'
import SubmitButton from '@/components/global/SubmitButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Err from '@/components/global/Err'
const NewCourseModal = () => {

  const { setIsLoading, setErr } = useGlobalStore()
  const { toggleCreateCourse, getCourses } = useAdminSupplierStore()

  const [course, setCourse] = useState('')

  const createCourse = async (e: any) => {
    e.preventDefault()
    try {
      if (!course) return alert('Fill up Course name')

      setIsLoading(true)
      const { data } = await axios.post('/api/courses', {
        name: course
      })

      if (data.ok) {
        getCourses()
        setIsLoading(false)
        toggleCreateCourse()
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

  const t = useTranslations()
  return (
    <form className='w-screen h-screen fixed top-0 left-o backdrop-blur  z-20 grid place-items-center' onSubmit={createCourse}>
      <Card className="w-full sm:w-[350px]">
        <CardHeader>
          <CardTitle>{t('course.create')}</CardTitle>
          <CardDescription><Err /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="course">{t("info.name")}</Label>
            <Input type="text" required id="course" placeholder={t("info.name")} value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex items-center gap-5 w-full">
          <Button variant={'outline'} type='button' className='w-full' onClick={toggleCreateCourse}>{t('operation.close')}</Button>
          <SubmitButton msg={t('operation.create')} variant={'default'} style='w-full' />
        </CardFooter>
      </Card>
    </form>
  )
}

export default NewCourseModal