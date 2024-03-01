'use client'
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

const CourseHeader: React.FC = ({ }) => {

    const { toggleCreateCourse } = useAdminSupplierStore()

    const t = useTranslations()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
            <h1 className='font-black text-xl uppercase'>{t('course.manage')}</h1>
            <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                {isAdminAllowed('create_courses') && <div onClick={toggleCreateCourse} className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('course.create')}</div>
                </div>}
                {isAdminAllowed('view_supplier') && <Link href='/admin/manage/supplier' className='flex items-center justify-center w-40 hover:text-primary cursor-pointer gap-1'>
                    <div>{t('supplier.manage')}</div>
                </Link>}
            </ul>
        </nav>
    )
}

export default CourseHeader
