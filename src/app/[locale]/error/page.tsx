'use client'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

const Page = () => {

    const t = useTranslations('auth')
    return (
        <div className='bg-slate-100 h-screen w-screen flex items-center justify-center'>
            <div className='bg-white px-20 py-10 shadow flex flex-col gap-5'>
                <h1 className='text-red-600  text-lg bg-red-100 text-center px-5 rounded-md py-1'>{t('error')}</h1>
                <button className='hover:text-blue-600 hover:underline self-center' onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>{t('signin')}</button>
            </div>
        </div>
    )
}

export default Page