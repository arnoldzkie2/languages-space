'use client'

import SideNav from '@/components/super-admin/SideNav'
import BookingHeader from '@/components/super-admin/management/booking/BookingHeader'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import React, { useState } from 'react'

const Page = () => {

  const { isSideNavOpen } = useAdminGlobalStore()

  const [formData, setFormData] = useState()

  const session = useSession()

  const createBooking = async (e: any) => {
    e?.preventDefault()

    try {

    } catch (error) {
      console.log(error);
      alert('Something went wrong')
    }
  }

  const t = useTranslations('super-admin')
  const clientHeaderSkeleton = (
    <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
  )

  return (
    <div className='h-screen'>
      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
          <h1 className='font-black text-gray-600 text-xl uppercase'>{t('booking.create')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5'>
            {session.status !== 'loading' ?
              <Link href={'/manage/schedule'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                <div>{t('schedule.h1')}</div>
              </Link> : clientHeaderSkeleton}
            {session.status !== 'loading' ?
              <Link href={'/manage/booking'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                <div>{t('booking.h1')}</div>
              </Link> : clientHeaderSkeleton}
          </ul>
        </nav>
        <div className='w-full px-8 h-full'>
          <form onSubmit={createBooking} className='bg-white w-1/2 h-full border '>

          </form>
        </div>

      </div>
    </div>
  )

}

export default Page