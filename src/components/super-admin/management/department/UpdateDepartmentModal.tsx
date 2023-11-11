/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { Department } from '@/lib/types/super-admin/globalType'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const UpdateDepartmentModal = () => {

    const { getDepartments,departmentData, isLoading, setIsLoading, closeUpdateDepartment } = useAdminGlobalStore()

    const [name, setName] = useState('')

    const updateDepartment = async (e: any) => {

        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.patch('/api/department', { name }, {
                params: { departmentID: departmentData?.id }
            })

            if (data.ok) {
                setIsLoading(false)
                setName('')
                closeUpdateDepartment()
                getDepartments()
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    useEffect(() => {
        setName(departmentData?.name!)
    }, [departmentData?.id])

 
    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (

        <div className='fixed top-0 left-0 z-40 grid place-items-center w-screen h-screen bg-black bg-opacity-40'>
            <form onSubmit={updateDepartment} className='bg-white w-96 p-10 gap-4 flex flex-col relative rounded-sm'>
                <h1 className='text-center'>{t('department.update')}</h1>
                <FontAwesomeIcon onClick={closeUpdateDepartment} icon={faXmark} width={16} height={16} className='cursor-pointer absolute top-4 right-4 hover:text-blue-600' />
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Department Name' className='outline-none px-3 py-1 border' />
                <div className='flex w-full gap-5 items-center'>
                    <button type='button' onClick={closeUpdateDepartment} className='border outline-none py-2 hover:bg-slate-100 text-slate-700 w-full rounded-sm'>{tt('close')}</button>
                    <button disabled={isLoading} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white w-full rounded-sm py-2`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : tt('update')}</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateDepartmentModal