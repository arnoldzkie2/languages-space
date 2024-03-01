import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import CreateTemplate from './CreateTemplate'

const CommentsTemplateHeader = () => {

    const t = useTranslations()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
            <h1 className='font-blacr text-xl uppercase'>{t('booking.comments.template.h1')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5'>
                <Link href={'/admin/manage/booking'} className='flex items-center text-muted-foreground justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('booking.manage')}</div>
                </Link>
                {isAdminAllowed('create_booking_comments_template') && <CreateTemplate />}
            </ul>
        </nav>
    )
}

export default CommentsTemplateHeader