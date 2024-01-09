'use client'
import useGlobalStore from '@/lib/state/globalStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const NewDepartmentModal = () => {

  const { getDepartments, isLoading, setIsLoading, toggleNewDepartment } = useGlobalStore()

  const [name, setName] = useState('')

  const createDepartment = async (e: any) => {

    e.preventDefault()
    try {

      setIsLoading(true)
      const { data } = await axios.post('/api/department', { name })

      if (data.ok) {
        setIsLoading(false)
        setName('')
        toggleNewDepartment()
        getDepartments()
      }

    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const t = useTranslations('super-admin')
  const tt = useTranslations('global')
  return (

    <div className='fixed top-0 left-0 grid place-items-center w-screen h-screen bg-black bg-opacity-40'>
      <form onSubmit={createDepartment} className='bg-white w-96 p-10 gap-4 flex flex-col relative rounded-sm'>
        <h1 className='text-center'>{t('department.create')}</h1>
        <FontAwesomeIcon onClick={toggleNewDepartment} icon={faXmark} width={16} height={16} className='cursor-pointer absolute top-4 right-4 hover:text-blue-600' />
        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Department Name' className='outline-none px-3 py-1 border' />
        <div className='flex w-full gap-5 items-center'>
          <button type='button' onClick={toggleNewDepartment} className='border outline-none py-2 hover:bg-slate-100 text-slate-700 w-full rounded-sm'>{tt('close')}</button>
          <button disabled={isLoading} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white w-full rounded-sm py-2`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : tt('create')}</button>
        </div>
      </form>
    </div>
  )
}

export default NewDepartmentModal