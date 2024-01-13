'use client'
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import DownloadTable from '../DownloadTable'
import useAdminStore from '@/lib/state/super-admin/adminStore'

const AdminHeader = () => {

    const { status } = useSession()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    const { admins, selectedAdmins } = useAdminStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('admin.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {status !== 'loading' ?
                    <Link href={'/manage/admin/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('admin.create')}</div>
                    </Link> : skeleton}
                {status !== 'loading' ?
                    <DownloadTable tables={admins} selectedTable={selectedAdmins} />
                    : skeleton}
            </ul>
        </nav>
    )
}

export default AdminHeader