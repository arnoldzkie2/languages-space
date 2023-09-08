import {  faSquarePlus, faUser } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next-intl/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

const ClientCardHeader = () => {

     const session = useSession()

    const t = useTranslations('super-admin')

    const clientHeaderSkeleton = (
        <li className='bg-slate-200 animate-pulse w-32 h-5 rounded-3xl'></li>
    )
    
    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client-card.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {session.status !== 'loading' ?
                    <Link href={'/manage/client'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('client.h1')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ?
                    <Link href={'/manage/client/card/new'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('client-card.create')}</div>
                    </Link> : clientHeaderSkeleton}
                {session.status !== 'loading' ? <Link href={'/manage/client/card/bind'} className='flex items-center gap-1 text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer'>
                    <div>{t('client.card.bind')}</div>
                </Link> : clientHeaderSkeleton}
            </ul>
        </nav>
    )
}

export default ClientCardHeader