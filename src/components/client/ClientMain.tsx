'use client'
import { useRouter } from '@/lib/navigation'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'

const ClientMain = () => {

  const router = useRouter()

  const t = useTranslations()
  return (
    <div className='padding pt-28 flex flex-col gap-10 lg:gap-20 lg:h-screen lg:justify-center lg:pt-0'>
      <div className='flex w-full items-center gap-10 flex-col md:flex-row xl:gap-0'>
        <div className='flex flex-col gap-4 items-center text-center md:text-left md:items-start md:w-full xl:w-4/5 2xl:w-2/3 md:gap-5 lg:pl-32 lg:border-l'>
          <h1 className='text-5xl xl:text-6xl font-extralight'>{t('client.page.main.h1')}</h1>
          <h2 className='text-muted-foreground xl:w-3/4'>{t('client.page.main.h2')}</h2>
          <div className='flex items-center gap-10 w-full sm:w-1/2'>
            <Button variant={'outline'} className='w-full' onClick={() => router.push('/client/buy')}>{t('client.page.header.buy_card')}</Button>
            <Button onClick={() => router.push('/client/booking')} className='w-full' >{t('client.page.header.book_now')}</Button>
          </div>
        </div>
        <Image src={'/main.png'} alt='Languages Space' width={350} height={350} className='h-auto w-full sm:w-2/3 md:w-1/2 2xl:w-1/4' />
      </div>
    </div>
  )
}

export default ClientMain