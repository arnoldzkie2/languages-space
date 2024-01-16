import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const AdminBindCardHeader = () => {

    const permissions = useAdminPageStore(s => s.permissions)

    const t = useTranslations('super-admin')

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
            <h1 className='font-black text-gray-600 text-xl uppercase'>{t('client.card.bind')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {permissions?.view_client &&
                    <Link href={'/admin/manage/client'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('client.h1')}</div>
                    </Link>}
                {permissions?.view_cards &&
                    <Link href={'/admin/manage/client/card'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('client-card.h1')}</div>
                    </Link>}
                {permissions?.create_cards &&
                    <Link href={'/admin/manage/client/card/new'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                        <div>{t('client-card.create')}</div>
                    </Link>}
            </ul>
        </nav>
    )
}

export default AdminBindCardHeader