import { Link } from '@/lib/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

const StatisticsHeader = () => {

    const t = useTranslations()
    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('side_nav.statistics')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                <Link href={'/admin'} className='flex items-center justify-center w-28 hover:text-primary cursor-pointer'>
                    <div>{t("side_nav.dashboard")}</div>
                </Link>
            </ul>
        </nav>)
}

export default StatisticsHeader