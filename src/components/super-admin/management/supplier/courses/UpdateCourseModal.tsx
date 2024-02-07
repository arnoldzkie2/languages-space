/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const UpdateCourseModal = () => {

    const { setIsLoading, setErr } = useGlobalStore()
    const { closeSelectedCourse, getCourses, selectedCourse } = useAdminSupplierStore()

    const [course, setCourse] = useState('')

    const updateCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (!course) return alert('Fill up Course name')

            setIsLoading(true)
            const { data, status } = await axios.patch('/api/courses', {
                name: course
            }, {
                params: {
                    courseID: selectedCourse?.id
                }
            })

            if (data.ok) {
                getCourses()
                toast("Success! course updated.")
                setIsLoading(false)
                closeSelectedCourse()
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

    useEffect(() => {

        setCourse(selectedCourse?.name || '')

    }, [selectedCourse?.id])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (
        <div className='w-screen h-screen fixed top-0 left-o backdrop-blur bg-opacity-40 z-20 grid place-items-center'>
            <Card>
                <CardHeader>
                    <CardTitle>{t("courses.update")}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={updateCourse} className='w-80 gap-5 relative flex flex-col'>
                        <Input
                            value={course}
                            required
                            onChange={(e) => setCourse(e.target.value)}
                            type="text" placeholder={t('courses.course-name')}
                        />
                        <div className='flex w-full items-center gap-5'>
                            <Button type='button' variant={'outline'} className='w-full' onClick={closeSelectedCourse}>{tt('close')}</Button>
                            <SubmitButton style='w-full' msg={tt("update")} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default UpdateCourseModal