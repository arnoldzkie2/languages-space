import { Link } from '@/lib/navigation'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import { useTranslations } from 'next-intl'
import React from 'react'

const DashboardHeader = () => {

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const t = useTranslations('super-admin')
    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('dashboard.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                {isAdminAllowed('view_statistics') &&
                    <Link href={'/admin/manage/statistics'} className='flex items-center justify-center w-28 hover:text-primary cursor-pointer'>
                        <div>{t("side-nav.statistics")}</div>
                    </Link>
                }
            </ul>
        </nav>)
}

export default DashboardHeader