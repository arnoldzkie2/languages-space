/* eslint-disable react-hooks/exhaustive-deps */
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
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const UpdateDepartmentModal = () => {

    const { getDepartments, departmentData, closeUpdateDepartment, updateDepartment } = useDepartmentStore()
    const { setIsLoading, setErr } = useGlobalStore()
    const [name, setName] = useState('')

    const updateDepartmentFunc = async (e: any) => {

        e.preventDefault()
        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/department', { name }, {
                params: { departmentID: departmentData?.id }
            })
            if (data.ok) {
                setIsLoading(false)
                setName('')
                toast('Success! department has been updated.')
                closeUpdateDepartment()
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

    useEffect(() => {
        setName(departmentData?.name!)
    }, [departmentData?.id])


    const t = useTranslations()

    if (!updateDepartment) return null

    return (

        <div className='fixed top-0 left-0 flex items-center justify-center z-30 w-screen h-screen backdrop-blur-sm'>
            <Card>
                <CardHeader>
                    <CardTitle>{t('department.update')}</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={updateDepartmentFunc} className='relative w-full flex flex-col gap-5'>
                        <Input required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('info.name')}
                        />
                        <div className='flex w-full gap-5 items-center'>
                            <Button type='button' variant={'ghost'} className='w-full' onClick={closeUpdateDepartment}>{t('operation.close')}</Button>
                            <SubmitButton msg={t('operation.update')} style='w-full' />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default UpdateDepartmentModal