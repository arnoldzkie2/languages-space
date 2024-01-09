'use client'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const NewCourseModal = () => {

  const { isLoading, setIsLoading } = useGlobalStore()
  const { toggleCreateCourse, getCourses } = useAdminSupplierStore()

  const [course, setCourse] = useState('')

  const createCourse = async (e: any) => {
    e.preventDefault()
    try {
      if (!course) return alert('Fill up Course name')

      setIsLoading(true)
      const { data, status } = await axios.post('/api/courses', {
        name: course
      })

      if (status === 409) {
        setIsLoading(false)
        setCourse('')
        return alert('Course already exist')
      }

      if (data.ok) {
        getCourses()
        setIsLoading(false)
        toggleCreateCourse()
      }

    } catch (error) {
      setIsLoading(false)
      console.log(error);
      alert('Something went wrong')
    }
  }

  const t = useTranslations('global')
  const tt = useTranslations('super-admin')
  return (
    <div className='w-screen h-screen fixed top-0 left-o bg-black bg-opacity-40 z-20 grid place-items-center'>
      <form onSubmit={createCourse} className='w-80 p-10 gap-5 rounded-md shadow relative bg-white flex flex-col'>

        <FontAwesomeIcon icon={faXmark} onClick={toggleCreateCourse} width={16} height={16} className='cursor-pointer absolute top-3 right-3 hover:text-blue-600' />
        <input
          value={course}
          required
          onChange={(e) => setCourse(e.target.value)}
          type="text" placeholder={tt('courses.course-name')}
          className='border outline-none px-3 py-1.5'
        />
        <button disabled={isLoading} className={`text-white rounded-md py-2 w-full ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : t('create')}</button>
      </form>
    </div>
  )
}

export default NewCourseModal