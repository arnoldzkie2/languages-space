import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'

const CardHeader = () => {

    const t = useTranslations()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('card.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                {isAdminAllowed('create_cards') &&
                    <Link href={'/admin/manage/card/new'} className='flex items-center text-muted-foreground hover:text-primary justify-center w-32 cursor-pointer gap-1'>
                        <div>{t('card.create')}</div>
                    </Link>}
                {isAdminAllowed('bind_cards') && <Link href={'/admin/manage/card/bind'} className='flex items-center gap-1 text-muted-foreground hover:text-primary justify-center w-32 cursor-pointer'>
                    <div>{t('card.bind')}</div>
                </Link>}
            </ul>
        </nav>
    )
}

export default CardHeader