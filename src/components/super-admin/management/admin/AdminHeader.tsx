'use client'
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import DownloadTable from '../DownloadTable'
import useAdminStore from '@/lib/state/super-admin/adminStore'
import { Skeleton } from '@/components/ui/skeleton'

const AdminHeader = () => {

    const { status } = useSession()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const skeleton = (
        <Skeleton className='w-40 h-5 rounded-3xl'></Skeleton>
    )

    const { admins, selectedAdmins } = useAdminStore()

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('admin.h1')}</h1>
            <ul className='flex items-center text-muted-foreground h-full ml-auto gap-5'>
                {status !== 'loading' ?
                    <Link href={'/admin/manage/admin/new'} className='flex items-center hover:text-primary justify-center w-40 cursor-pointer gap-1'>
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